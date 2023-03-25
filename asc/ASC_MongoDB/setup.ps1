$SRV_NAME="mongodb"
docker stop $SRV_NAME
docker rm --force $SRV_NAME
docker rmi --force asc/$SRV_NAME

docker build -t asc/$SRV_NAME .

docker stop $SRV_NAME
docker rm $SRV_NAME 
# "-p 27017:27017" switch allows host 0.0.0.0 to directly access MongoDB for dev purposes, but not necessary for APIs to connect even with local dev. In production MondoDB will be on separate network only acccesible via the APIs. "-p 28017:28017"" is to access the MongoDB http interface http://localhost:28017
docker run -p 27017:27017 -p 28017:28017 -d --name $SRV_NAME asc/$SRV_NAME 