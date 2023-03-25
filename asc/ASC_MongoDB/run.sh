#!/bin/bash
SRV_NAME="mongodb"
docker stop $SRV_NAME
docker rm $SRV_NAME 
docker run -d --name $SRV_NAME asc/$SRV_NAME 

