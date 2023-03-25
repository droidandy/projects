#!/bin/sh
# Build image used for deploying environment and push it to AWS ECR
# Usage:
#   ./build-deploy-env-image.sh <ecrURL> [<deployEnvRepoName>]
#
# ecrURL should be like <AWS-account-id>.dkr.ecr.<region-name>.amazonaws.com
# deployEnvRepoName is optional, by default equals aou-backend-deploy
set -e

if [[ $# -le 1 ]] ; then
  echo "ecrURL (given as <AWS-account-id>.dkr.ecr.<region-name>.amazonaws.com) is an obilgatory argument" >&2; exit 1
fi
ECR_URL=$1
DEPLOY_ENV_ECR=$2
if [[ -z "$DEPLOY_ENV_ECR" ]] ; then
  DEPLOY_ENV_ECR=aou-backend-deploy
fi
DEPLOY_ENV_IMAGE_TAG=$ECR_URL/${DEPLOY_ENV_ECR}:latest

full_path=$(realpath $0)
dir_path=$(dirname $full_path)

aws ecr get-login-password | docker login --username AWS --password-stdin ${DEPLOY_ENV_IMAGE_TAG}
container_ids=$(docker ps -a | grep "${DEPLOY_ENV_IMAGE_TAG}" | awk '{ print $1 }')
if [ -n "${container_ids}" ]; then \
  docker stop $container_ids; \
  docker rm $container_ids; \
fi
docker rmi ${DEPLOY_ENV_IMAGE_TAG} -f
docker build --tag ${DEPLOY_ENV_IMAGE_TAG} --file Dockerfile-deploy-env $dir_path
docker push $DEPLOY_ENV_IMAGE_TAG
images_to_delete=$( aws ecr list-images --repository-name ${DEPLOY_ENV_ECR} --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json )
aws ecr batch-delete-image --repository-name ${DEPLOY_ENV_ECR} --image-ids "$images_to_delete" || true
