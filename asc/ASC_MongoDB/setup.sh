#!/bin/bash
SRV_NAME="mongodb"
docker stop $SRV_NAME
docker rm --force $SRV_NAME
docker rmi --force asc/$SRV_NAME

docker build -t asc/$SRV_NAME .

./run.sh