composer archive create -t dir -n .
composer network install -a "afyachain-network@$1.bna" -c PeerAdmin@hlfv1
composer network upgrade -c PeerAdmin@hlfv1 -n afyachain-network -V "$1"
