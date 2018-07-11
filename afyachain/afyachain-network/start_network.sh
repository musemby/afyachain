cd ~/personal/leproject/afyachain/afyachain-network
composer network install --card PeerAdmin@hlfv1 --archiveFile "afyachain-network@$1.bna"
composer network start --networkName afyachain-network --networkVersion "$1" --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer network ping --card admin@afyachain-network