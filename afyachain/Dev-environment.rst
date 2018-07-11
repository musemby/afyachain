To start a new development session
==================================
1. `./stopFabric.sh`
2. `./teardownFabric.sh`
3. `./startFabric.sh`
4. `./createPeerAdminCard.sh`

New tab
-------

1. composer network install --card PeerAdmin@hlfv1 --archiveFile afyachain-network@0.0.2.bna
2. composer network start --networkName afyachain-network --networkVersion 0.0.2 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
3. composer network ping --card admin@afyachain-network

// upgrading
1. Update package.json with the new version
2. `composer archive create -t dir -n .`
3. `composer network install -a afyachain-network@0.0.2.bna -c PeerAdmin@hlfv1`
4. `composer network upgrade -c PeerAdmin@hlfv1 -n afyachain-network -V 0.0.2`


// port 3000
-. composer-rest-server -c admin@afyachain-network -n never -w true

// port 4200 (angular app)
-. npm start
