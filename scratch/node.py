import json
import os
import sync

from flask import Flask

from block import Block


node = Flask(__name__)
node_blocks = sync.sync()


@node.route('/blockchain.json', methods=['GET'])
def blockchain():
    """
    Shoots back the blockchain, which in our case, is a json list of hashes
    with the block information which is:
    """
    node_blocks = sync.sync() # update is they've changed

    python_blocks = []
    for block in node_blocks:
        python_blocks.append(block.__dict__())
    json_blocks = json.dumps(python_blocks)
    return json_blocks


if __name__ == '__main__':
    node.run()
