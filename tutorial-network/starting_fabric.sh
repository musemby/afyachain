cd ~/fabric-tools
./startFabric.sh
./createPeerAdminCard.sh

# stopping fabric
~/fabric-tools/stopFabric.sh
~/fabric-tools/teardownFabric.sh

# starting the web app (playground) -- will run on localhost:9090
composer-playground -p 9090