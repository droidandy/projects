#!/bin/sh
# Build SFTP server image and push it to Gitlab Docker Registry
# Usage:
#   ./build-sftp-image.sh <registry_username> <registry_password> <image_tag>
# For example:
#   ./build-sftp-image.sh username@email.com password registry.gitlab.com/empala/aou-backend/sftp:latest


DOCKER_REGISTRY_USERNAME=$1
DOCKER_REGISTRY_PASSWORD=$2
SFTP_SERVER_IMAGE_TAG=$3

docker login registry.gitlab.com -u ${DOCKER_REGISTRY_USERNAME} -p ${DOCKER_REGISTRY_PASSWORD}
docker build -f Dockerfile-sftp -t ${SFTP_SERVER_IMAGE_TAG} .
docker push ${SFTP_SERVER_IMAGE_TAG}
