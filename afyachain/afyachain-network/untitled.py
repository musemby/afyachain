"""
Offline Code Generators and Checkers
"""

from __future__ import unicode_literals

import hashlib
import math
import os
import six

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms
from cryptography.hazmat.backends import default_backend

from . import checksum



def nonce_generator(nonce_len=2):
    random_bytes = os.urandom(nonce_len)
    return random_bytes.encode('hex') if six.PY2 else random_bytes.hex()


class Version1Code(object):
    """
<MEMBER_NO><PROVIDER><PAYER><BENEFIT> **<VERSION><NONCE><AMOUNT><TIME><CHECK>**

================ ============================================ ================
 Section           Description                                  Offset (Len)
================ ============================================ ================
 Member Number    The member's beneficiary code                n/a (variable)
 Provider Code    The provider's SLADE code                    n/a (variable
 Payer Code       The payer's SLADE code                       n/a (variable)
 Benefit Code     The benefit's code                           n/a (variable)
 Version          Version of the offline code                   0 (1)
 Nonce            Nonce used for encryption                     1 (4)
 Amount           Amount approved                               5 (6)
 Time             Time the approval was done                   11 (8)
 Check            Check byte used to verify correctness        19 (1)
================ ============================================ ================

Member identifier, provider identifier, payer identifier and benefit code shall
not be visible to the user but they are known to both the payer and provider.

The approved limit and the time generated are the only pieces of information
that are sourced from one side only (payer). Thus, they are the only pieces of
information to be encrypted. Encryption shall be done using a stream cipher
because of:

#. The amount of data to be encrypted is smaller than what cryptographically
   strong block ciphers require.
#. Stream ciphers allow an arbitrary amount of data to be encrypted. Thus, if
   the code's length increases or reduces, the cipher won't mind.

The check byte shall be used to ensure typos do not affect the process and thus
being able to differentiate between simple typo-related mistakes from actual
invalid codes.

.. danger::

    This is a description of a **COMPLETELY FLAWED APPLICATION OF
    CRYPTOGRAPHY**. It should not be used as an example of how to apply crypto.

    """
    VERSION = 1
    VERSION_NAME = 'Version 1'

    @classmethod
    def _is_my_code(cls, offline_code):
        version = offline_code[0]
        if version != str(cls.VERSION):
            return False

        if not len(offline_code) == 20:
            return False

        if not checksum.luhn_checker(offline_code):
            return False

        return True

    @classmethod
    def _get_cipher(cls, nonce_bytes, **kwargs):
        key = hashlib.sha256(
            '{}-{}-{}-{}'.format(
                kwargs['member_number'],
                kwargs['payer_code'],
                kwargs['provider_code'],
                kwargs['benefit_code'],
            ).encode('utf-8')
        ).digest()
        # may the cryptographic sins that lie here be forgiven
        algorithm = algorithms.ChaCha20(key, nonce_bytes*4)
        return Cipher(algorithm, mode=None, backend=default_backend())

    @classmethod
    def encode(cls, **kwargs):
        """Generate the offline code
        #. Encoding
            - create a 2-byte nonce and convert each byte to hex         (a)
            - convert the approved amount to it's hex equivalent         (b)
            - convert the current time to it's hex equivalent            (c)
            - create a string with amount-time                           (d)
            - convert (d) to bytes using a pair of values as one byte    (e)

        #. Encryption
            - create a 256-byte hash of member_no-payer-provider-benefit (f)
            - use a stream cipher for encryption with (a) as the nonce,
              (f) as the 32 byte key, and (e) as the plain-text          (g)

        #. Combine 'em all
            - combine code version, (a) and (g)                          (h)
            - calculate the check digit of (h) using Luhn mod-16         (i)
            - append (i) to (h)                                          (j)

        \(j\) is the generated offline code
        """
        # TODO validate (approved_amount < 10,000,000) or
        #               (approved_amount <= 0xffffff)
        # TODO validate timestamp < time.time()
        # TODO validate len(nonce) == 4 and is hex digits
        nonce_bytes = kwargs['nonce'].encode('utf-8')
        b = int(math.ceil(kwargs.get('approved_amount', '0')))
        c = int(math.ceil(kwargs['timestamp']))
        d = '{:0>6x}{:0>8x}'.format(b, c)
        e = bytes.fromhex(d)

        cipher = cls._get_cipher(nonce_bytes, **kwargs)
        encryptor = cipher.encryptor()
        cipher_text = encryptor.update(e)

        g = cipher_text.hex()
        h = '{}{}{}'.format(cls.VERSION, kwargs['nonce'], g)
        i = checksum.luhn_generator(h)
        return '{}{}'.format(h, i)

    @classmethod
    def is_valid(cls, offline_code, **kwargs):
        """Checks if the offline code is valid
        """
        return (
            cls._is_my_code(offline_code) and
            cls.encode(**kwargs) == offline_code
        )

    @classmethod
    def decode(cls, offline_code, **kwargs):
        """Decode the offline code

        Decodes code generated by Version1Code.encode and get the
        amount approved and time approved
        """
        if not cls._is_my_code(offline_code):
            return False

        nonce_bytes = offline_code[1:5].encode('utf-8')
        cipher_text = bytes.fromhex(offline_code[5:19])

        cipher = cls._get_cipher(nonce_bytes, **kwargs)
        decryptor = cipher.decryptor()
        plain_text = decryptor.update(cipher_text)
        plain_text_hex = plain_text.hex()
        return (
            int(plain_text_hex[:6], base=16),
            int(plain_text_hex[6:], base=16),
        )


class Version2Code(object):
    VERSION = 2
    VERSION_NAME = 'Version 2'

    @classmethod
    def encode(cls, **kwargs):
        """Offline code generation

        <version>
        sha1(
            <mno>
            <payer>
            <provider>
            <benefit code>
            <approved amount>
        )
        <checkdigit>
        """
        s = "{mno}-{provider}-{payer}-{benefit}"
        s = s.format(
            mno=kwargs['member_number'],
            payer=kwargs['payer_code'],
            provider=kwargs['provider_code'],
            benefit=kwargs['benefit_code']
        )
        # a preauth has an amount but a payer auth does not
        amount = kwargs.get('approved_amount')
        if amount:
            s = s + '-{amount}'.format(amount)

        encoded = s.encode('utf-8')
        digest = hashlib.sha1(encoded).hexdigest()
        code = '{}{}'.format(cls.VERSION, digest)
        checkdigit = checksum.luhn_generator(code)
        return '{}{}'.format(code, checkdigit)

    @classmethod
    def is_valid(cls, offline_code, **kwargs):
        """Offline code validation"""
        version = offline_code[0]
        if version != str(cls.VERSION):
            return False

        if not checksum.luhn_checker(offline_code):
            return False

        code = cls.encode(**kwargs)
        return code == offline_code

    @classmethod
    def decode(cls, offline_code, **kwargs):
        return None


#: A pointer to the latest version
LatestVersion = Version2Code

#: Used as choice options in model fields
OFFLINE_CODE_VERSIONS = (
    (Version1Code.VERSION, Version1Code.VERSION_NAME),
    (Version2Code.VERSION, Version2Code.VERSION_NAME),
)

#: A simple map of version identifier to code class
VERSION_MAP = {
    Version1Code.VERSION: Version1Code,
    Version2Code.VERSION: Version2Code,
}
