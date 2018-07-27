# 1. Update the package.json with the new version X then use X as the argument to this script
composer archive create -t dir -n .
composer network install -a "afyachain-network@0.0.$1.bna" -c PeerAdmin@hlfv1
composer network upgrade -c PeerAdmin@hlfv1 -n afyachain-network -V "0.0.$1"
