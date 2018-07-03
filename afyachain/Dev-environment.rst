To start a new development session
==================================
1. `./stopFabric.sh`
2. `./teardownFabric.sh`
3. `./startFabric.sh`
4. `./createPeerAdminCard.sh`

New tab
-------

1. composer network install --card PeerAdmin@hlfv1 --archiveFile afyachain-network@0.0.1.bna
2. composer network start --networkName afyachain-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
3. composer network ping --card admin@tutorial-network

// port 3000
4. composer-rest-server -c admin@afyachain-network -n never -w true

// port 4200 (angular app)
5. npm start