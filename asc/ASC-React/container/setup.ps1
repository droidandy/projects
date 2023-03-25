# This PowerShell script will build and run the image on a Windows OS based host
# Prerequisites are the following to be installed:
# https://docs.docker.com/docker-for-windows/
# http://gnuwin32.sourceforge.net/packages/gtar.htm and tar must be in PATH
# This script must be run from the root path of the repository i.e. .\container\setup.ps1

$SRV_NAME="ascreact"
docker stop $SRV_NAME
docker rm --force $SRV_NAME
docker rmi --force asc/$SRV_NAME

tar cvf ascweb.tar.gz -C ./ ./www/* ./src/config.js index.js
#append the needed files from the ./container directory to root app directory
tar rvf ascweb.tar.gz -C ./container package.json app.js

docker build -f .\container\Dockerfile -t asc/$SRV_NAME .

docker run -p 8080:8080 -d --name $SRV_NAME asc/$SRV_NAME