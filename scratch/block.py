import datetime
import hashlib
import json
import os


class Block(object):

    def __init__(self, dictionary):
        for k, v in dictionary.items():
            setattr(self, k, v)

        if not hasattr(self, 'hash'):
            self.hash = self.create_self_hash()

    def header_string(self):
        return str(self.index) + str(self.prev_hash) + str(self.data) + str(self.timestamp)

    def create_self_hash(self):
        sha = hashlib.sha256()
        sha.update(self.header_string())
        return sha.hexdigest()

    def self_save(self):
        chaindata_dir = 'chaindata'
        index_string = str(self.index).zfill(6)
        filename = '{}/{}.json'.format(chaindata_dir, index_string)
        with open(filename, 'w') as block_file:
            json.dump(self.__dict__(), block_file)

    def __dict__(self):
        return {
            'index': str(self.index),
            'timestamp': str(self.timestamp),
            'prev_hash': str(self.prev_hash),
            'hash': str(self.hash),
            'data': str(self.data)
        }

    def __str__(self):
        return 'Block<prev_hash: %s,hash: %s>' % (self.prev_hash, self.hash)

def create_first_block():
    block_data = {}
    block_data['index'] = 0
    block_data['timestamp'] = datetime.datetime.now()
    block_data['data'] = 'First block data'
    block_data['prev_hash'] = None
    block = Block(block_data)
    return block


if __name__ == '__main__':
    # check if the chaindata folder exists
    chaindata_dir = 'chaindata'
    if not os.path.exists(chaindata_dir):
        # make chaindata dir
        os.mkdir(chaindata_dir)
    # check if dir is empty

    if os.listdir(chaindata_dir) == []:
        # create first block
        first_block = create_first_block()
        import pdb; pdb.set_trace()
        first_block.self_save()
