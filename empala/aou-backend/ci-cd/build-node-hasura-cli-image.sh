#!/bin/sh
# Build Node image with hasura-cli tool installed and push it to Gitlab Docker Registry
# Usage:
#   ./build-node-hasura-cli-image.sh <registry_username> <registry_password> <image_tag>
# For example:
#   ./build-node-hasura-cli-image.sh username@email.com password registry.gitlab.com/empala/aou-backend/hasura-cli:latest


DOCKER_REGISTRY_USERNAME=$1
DOCKER_REGISTRY_PASSWORD=$2
HASURA_CLI_IMAGE_TAG=$3

docker login registry.gitlab.com -u ${DOCKER_REGISTRY_USERNAME} -p ${DOCKER_REGISTRY_PASSWORD}
docker build -f Dockerfile-hasura-cli -t ${HASURA_CLI_IMAGE_TAG} .
docker push ${HASURA_CLI_IMAGE_TAG}
