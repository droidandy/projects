#!/bin/sh
# Deploy core backend with Apollo and Hasura GraphQL servers in AWS EKS, to be used ONLY in .gitlab-ci.yml
# Usage:
#   ./deploy-core-be.sh <envTag> [<apolloImageTag>] [<hasuraImageTag>] [--noclean]
#
# envTag should be like dev, stg, prod
# if apolloImageTag or hasuraImageTag are given, the respective images are pulled instead of building new ones
set -e
set -f
set -o noglob

if [[ $# -lt 1 ]] ; then
  echo "envTag is an obligatory argument" >&2; exit 1
fi
ENV_TAG=$1
if [[ "$2" = "--noclean" ]]; then
  APOLLO_IMAGE_TAG=""
  HASURA_IMAGE_TAG=""
  NOCLEAN_FLAG=$2
else
  APOLLO_IMAGE_TAG=$2
  if [[ "$3" = "--noclean" ]]; then
    HASURA_IMAGE_TAG=""
    NOCLEAN_FLAG=$3
  else
    HASURA_IMAGE_TAG=$3
    NOCLEAN_FLAG=$4
  fi
fi

full_path=$(realpath $0)
dir_path=$(dirname $full_path)

HELM_ADD_SET_ARGS=""

cd $dir_path/../products
if [[ ! -z "$APOLLO_IMAGE_TAG" || ! -z "$HASURA_IMAGE_TAG" ]]; then
  docker login --username $CI_REGISTRY_USER --password $CI_REGISTRY_PASSWORD $CI_REGISTRY
  if [[ ! -z "$APOLLO_IMAGE_TAG" ]]; then
    docker pull ${APOLLO_IMAGE_TAG}
  fi
  if [[ ! -z "$HASURA_IMAGE_TAG" ]]; then
    docker pull ${HASURA_IMAGE_TAG}
  fi
fi
docker login --username AWS --password $(aws ecr get-login-password --region $AWS_DEFAULT_REGION) ${ECR_REPOSITORY}
if [[ -z "$APOLLO_IMAGE_TAG" ]] ; then
  docker build --tag ${ECR_REPOSITORY}:apollo-${CI_PIPELINE_ID} --file Dockerfile-apollo .
else
  docker image tag ${APOLLO_IMAGE_TAG} ${ECR_REPOSITORY}:apollo-${CI_PIPELINE_ID}
fi
docker push ${ECR_REPOSITORY}:apollo-${CI_PIPELINE_ID}
if [[ -z "$HASURA_IMAGE_TAG" ]] ; then
  docker build --tag ${ECR_REPOSITORY}:hasura-${CI_PIPELINE_ID} --file Dockerfile-hasura .
else
  docker image tag ${HASURA_IMAGE_TAG} ${ECR_REPOSITORY}:hasura-${CI_PIPELINE_ID}
fi
docker push ${ECR_REPOSITORY}:hasura-${CI_PIPELINE_ID}
docker build --tag ${ECR_REPOSITORY}:dbmigration-${CI_PIPELINE_ID} --file Dockerfile-dbmigration .
docker push ${ECR_REPOSITORY}:dbmigration-${CI_PIPELINE_ID}
docker build --tag ${ECR_REPOSITORY}:hasura-${CI_PIPELINE_ID} --file Dockerfile-hasura .
docker push ${ECR_REPOSITORY}:hasura-${CI_PIPELINE_ID}
docker build --build-arg HASURA_CLI_IMAGE_TAG=${HASURA_CLI_IMAGE_TAG} --tag ${ECR_REPOSITORY}:hasura-metadata-${CI_PIPELINE_ID} --file Dockerfile-hasura-metadata .
docker push ${ECR_REPOSITORY}:hasura-metadata-${CI_PIPELINE_ID}

if [[ ! -z "$APEX_EXTRACTS_DATA_GRABBER_SCHEDULE" || ! -z "$MORNING_STAR_DATA_GRABBER_SCHEDULE" ]]; then
  if [[ -z "${AWS_COGNITO_USER_POOL_ID}" ]]; then
    echo "AWS_COGNITO_USER_POOL_ID environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set awsCognito.userPoolId=${AWS_COGNITO_USER_POOL_ID}"
  fi
  if [[ -z "${AWS_COGNITO_CLIENT_ID}" ]]; then
    echo "AWS_COGNITO_CLIENT_ID environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set awsCognito.clientId=${AWS_COGNITO_CLIENT_ID}"
  fi
  if [[ -z "${AWS_COGNITO_MARKETDATA_UPDATER_USER_NAME}" ]]; then
    echo "AWS_COGNITO_MARKETDATA_UPDATER_USER_NAME environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set awsCognito.marketdataUpdaterUserName=${AWS_COGNITO_MARKETDATA_UPDATER_USER_NAME}"
  fi
  if [[ -z "${AWS_COGNITO_MARKETDATA_UPDATER_USER_PASSWORD}" ]]; then
    echo "AWS_COGNITO_MARKETDATA_UPDATER_USER_PASSWORD environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set awsCognito.marketdataUpdaterUserPassword=${AWS_COGNITO_MARKETDATA_UPDATER_USER_PASSWORD}"
  fi
fi

if [[ ! -z "$APEX_EXTRACTS_DATA_GRABBER_SCHEDULE" ]]; then
  APEX_EXTRACTS_DATA_GRABBER_SCHEDULE_ENCODED=$(echo "$APEX_EXTRACTS_DATA_GRABBER_SCHEDULE" | base64)
  HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtracts.isScheduleB64Encoded=true --set dataGrabbers.apexExtracts.schedule=${APEX_EXTRACTS_DATA_GRABBER_SCHEDULE_ENCODED}"
  if [[ -z "${APEX_EXTRACTS_DAYS_BEFORE_CURRENT}" ]]; then
    echo "APEX_EXTRACTS_DAYS_BEFORE_CURRENT environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtracts.daysBeforeCurrent=${APEX_EXTRACTS_DAYS_BEFORE_CURRENT}"
  fi
  if [[ -z "${APEX_EXTRACTS_SFTP_HOST}" ]]; then
    echo "APEX_EXTRACTS_SFTP_HOST environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtracts.SFTPHost=${APEX_EXTRACTS_SFTP_HOST}"
  fi
  if [[ -z "${APEX_EXTRACTS_SFTP_PORT}" ]]; then
    echo "APEX_EXTRACTS_SFTP_PORT environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtracts.SFTPPort=${APEX_EXTRACTS_SFTP_PORT}"
  fi
  if [[ -z "${APEX_EXTRACTS_SFTP_USER}" ]]; then
    echo "APEX_EXTRACTS_SFTP_USER environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtracts.SFTPUser=${APEX_EXTRACTS_SFTP_USER}"
  fi
  if [[ -z "${APEX_EXTRACTS_SFTP_PRIVATE_KEY}" ]]; then
    echo "APEX_EXTRACTS_SFTP_PRIVATE_KEY environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtracts.SFTPPrivateKey=${APEX_EXTRACTS_SFTP_PRIVATE_KEY}"
  fi
  docker build --tag ${ECR_REPOSITORY}:apex-ext-datagrabber-${CI_PIPELINE_ID} --file Dockerfile-apex-ext-datagrabber .
  docker push ${ECR_REPOSITORY}:apex-ext-datagrabber-${CI_PIPELINE_ID}
  fi

if [[ ! -z "$MORNING_STAR_DATA_GRABBER_SCHEDULE" ]]; then
  MORNING_STAR_DATA_GRABBER_SCHEDULE_ENCODED=$(echo "$MORNING_STAR_DATA_GRABBER_SCHEDULE" | base64)
  HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.morningStar.isScheduleB64Encoded=true --set dataGrabbers.morningStar.schedule=${MORNING_STAR_DATA_GRABBER_SCHEDULE_ENCODED}"
  if [[ -z "${MORNING_STAR_HOST}" ]]; then
    echo "MORNING_STAR_HOST environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.morningStar.host=${MORNING_STAR_HOST}"
  fi
  if [[ -z "${MORNING_STAR_USER}" ]]; then
    echo "MORNING_STAR_USER environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.morningStar.user=${MORNING_STAR_USER}"
  fi
  if [[ -z "${MORNING_STAR_PASSWORD}" ]]; then
    echo "MORNING_STAR_PASSWORD environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.morningStar.password=${MORNING_STAR_PASSWORD}"
  fi
  docker build --tag ${ECR_REPOSITORY}:morningstar-datagrabber-${CI_PIPELINE_ID} --file Dockerfile-morningstar-datagrabber .
  docker push ${ECR_REPOSITORY}:morningstar-datagrabber-${CI_PIPELINE_ID}
fi

if [[ ! -z "$APEX_EXTEND_LOGOS_DATA_GRABBER_SCHEDULE" ]]; then
  APEX_EXTEND_LOGOS_DATA_GRABBER_SCHEDULE_ENCODED=$(echo "$APEX_EXTEND_LOGOS_DATA_GRABBER_SCHEDULE" | base64)
  HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtendLogos.isScheduleB64Encoded=true --set dataGrabbers.apexExtendLogos.schedule=${APEX_EXTEND_LOGOS_DATA_GRABBER_SCHEDULE_ENCODED}"
  if [[ -z "${APEX_EXTEND_LOGOS_AWS_ACCESS_KEY_ID}" ]]; then
    echo "APEX_EXTEND_LOGOS_AWS_ACCESS_KEY_ID environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtendLogos.AWSAccessKeyId=${APEX_EXTEND_LOGOS_AWS_ACCESS_KEY_ID}"
  fi
  if [[ -z "${APEX_EXTEND_LOGOS_AWS_SECRET_ACCESS_KEY}" ]]; then
    echo "APEX_EXTEND_LOGOS_AWS_SECRET_ACCESS_KEY environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtendLogos.AWSSecretAccessKey=${APEX_EXTEND_LOGOS_AWS_SECRET_ACCESS_KEY}"
  fi
  if [[ -z "${APEX_EXTEND_LOGOS_AWS_REGION}" ]]; then
    echo "APEX_EXTEND_LOGOS_AWS_REGION environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtendLogos.AWSRegion=${APEX_EXTEND_LOGOS_AWS_REGION}"
  fi
  if [[ -z "${APEX_EXTEND_LOGOS_AWS_S3_BUCKET_NAME}" ]]; then
    echo "APEX_EXTEND_LOGOS_AWS_S3_BUCKET_NAME environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtendLogos.AWSS3BucketName=${APEX_EXTEND_LOGOS_AWS_S3_BUCKET_NAME}"
  fi
  if [[ -z "${APEX_EXTEND_LOGOS_AWS_CLOUDFRONT_URL}" ]]; then
    echo "APEX_EXTEND_LOGOS_AWS_CLOUDFRONT_URL environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set dataGrabbers.apexExtendLogos.AWSCloudFrontUrl=${APEX_EXTEND_LOGOS_AWS_CLOUDFRONT_URL}"
  fi
  docker build --tag ${ECR_REPOSITORY}:ae-logos-datagrabber-${CI_PIPELINE_ID} --file Dockerfile-ae-logos-datagrabber .
  docker push ${ECR_REPOSITORY}:ae-logos-datagrabber-${CI_PIPELINE_ID}
fi

sed -i "s/^name:.*$/name: aou-backend-${ENV_TAG}/" ${CI_PROJECT_DIR}/products/chart/Chart.yaml
sed -i "s/^version:.*$/version: ${CI_PIPELINE_ID}/" ${CI_PROJECT_DIR}/products/chart/Chart.yaml
sed -i "s/^appVersion:.*$/appVersion: ${CI_PIPELINE_ID}/" ${CI_PROJECT_DIR}/products/chart/Chart.yaml

kubectl create namespace ${KUBE_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
if [[ "$NOCLEAN_FLAG" != "--noclean" ]]; then
  helm uninstall --namespace ${KUBE_NAMESPACE} aou-backend-${ENV_TAG} || true
  kubectl -n ${KUBE_NAMESPACE} get pvc -l app.kubernetes.io/instance=aou-backend-${ENV_TAG} -o jsonpath='{.items..metadata.name}' | \
    xargs --no-run-if-empty -r kubectl -n ${KUBE_NAMESPACE} delete pvc
fi

if [[ ! -z "${EXTERNAL_DB_HOST}" ]]; then
  HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set database.host=${EXTERNAL_DB_HOST}"
  if [[ -z "${EXTERNAL_DB_NAME}" ]]; then
    echo "EXTERNAL_DB_NAME environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set database.name=${EXTERNAL_DB_NAME}"
  fi
  if [[ -z "${EXTERNAL_DB_USER}" ]]; then
    echo "EXTERNAL_DB_USER environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set database.user=${EXTERNAL_DB_USER}"
  fi
  if [[ -z "${EXTERNAL_DB_PASSWORD}" ]]; then
    echo "EXTERNAL_DB_PASSWORD environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set database.password=${EXTERNAL_DB_PASSWORD}"
  fi
  if [[ -z "${EXTERNAL_DB_PORT}" ]]; then
    echo "EXTERNAL_DB_PORT environment variable should be nonempty" >&2; exit 1
  else
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set database.port=${EXTERNAL_DB_PORT}"
  fi
  if [[ ! -z "${EXTERNAL_DB_CA_CERT}" ]]; then
    HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set database.sslCACert=${EXTERNAL_DB_CA_CERT}"
  fi
fi

APEX_EXTEND_TRADE_ACCOUNT_ID_ENCODED=$(echo "$APEX_EXTEND_TRADE_ACCOUNT_ID" | base64 | sed ':a;N;$!ba;s/\n//g')
HELM_ADD_SET_ARGS="$HELM_ADD_SET_ARGS --set apex.extend.isTradeAccountIdBase64Encoded=true --set apex.extend.tradeAccountId=${APEX_EXTEND_TRADE_ACCOUNT_ID_ENCODED}"

helm_upgrade_passed=false
for subver in $(seq 0 2)
do
  helm upgrade --install --namespace ${KUBE_NAMESPACE} --version ${CI_PIPELINE_ID}:$subver \
    --set environment=${NODE_ENV} --set image.repository=${ECR_REPOSITORY} \
    --set awsCognito.JWKSClient=${AWS_COGNITO_JWKS_CLIENT} \
    --set awsCognito.audienceClaim=${AWS_COGNITO_AUDIENCE_CLAIM} \
    --set awsCognito.issuerClaim=${AWS_COGNITO_ISSUER_CLAIM} \
    --set ingress.enabled=true --set ingress.host=${ENV_TAG}-${EXTERNAL_URL_RANDOM_HASH}.launchpad-saas.net \
    --set ingress.sslCert=${AWS_SSL_CERT_ARN} --set ingress.wafWaclArn=${WAF_WACL_ARN} \
    --set annotations.CIEnvironmentSlug=$CI_ENVIRONMENT_SLUG --set annotations.CIProjectPathSlug=$CI_PROJECT_PATH_SLUG \
    --set hasura.adminSecret=${HASURA_GRAPHQL_ADMIN_SECRET} \
    --set authentication.readonlyAdminUserName=${AWS_COGNITO_READONLY_ADMIN_USER_NAME} \
    --set authentication.marketdataUpdaterUserName=${AWS_COGNITO_MARKETDATA_UPDATER_USER_NAME} \
    --set authentication.marketdataUpdaterUserPassword=${AWS_COGNITO_MARKETDATA_UPDATER_USER_PASSWORD} \
    --set apexExtend.logosApiUrl=${APEX_EXTEND_LOGOS_API_URL} \
    --set apexExtend.logosApiKey=${APEX_EXTEND_LOGOS_API_KEY} \
    --set apexExtend.logosApiSecret=${APEX_EXTEND_LOGOS_API_SECRET} \
    --set instrumentCache.loadingBatchSize=${INSTRUMENT_CACHE_LOADING_BATCH_SIZE} \
    --set instrumentCache.reloadUTCTime=${INSTRUMENT_CACHE_RELOAD_UTC_TIME} \
    --set apex.extend.tradeApiUrl=${APEX_EXTEND_TRADE_API_URL} \
    --set apex.extend.tradeApiEntity=${APEX_EXTEND_TRADE_API_ENTITY} \
    --set apex.extend.tradeApiGroup=${APEX_EXTEND_TRADE_API_GROUP} \
    --set apex.extend.tradeApiKey=${APEX_EXTEND_TRADE_API_KEY} \
    --set apex.extend.applicationsUrl=${APEX_EXTEND_APPLICATIONS_URL} \
    --set apex.extend.userId=${APEX_EXTEND_APPLICATIONS_USER_ID} \
    --set apex.extend.adminApiKey=${APEX_EXTEND_APPLICATIONS_ADMIN_API_KEY} \
    --set apex.extend.adminApiSecret=${APEX_EXTEND_APPLICATIONS_ADMIN_API_SECRET} \
    ${HELM_ADD_SET_ARGS} -f ${CI_PROJECT_DIR}/products/chart/values.yaml --wait --wait-for-jobs \
    aou-backend-${ENV_TAG} ${CI_PROJECT_DIR}/products/chart/ && \
    sleep 5s && kubectl --namespace ${KUBE_NAMESPACE} get ingress aou-backend-${ENV_TAG} && helm_upgrade_passed=true && break
  echo "helm upgrade failed, trying to do this again..."
  sleep 1s
done
if [[ "$helm_upgrade_passed" = "true" ]]; then
  kubectl --namespace ${KUBE_NAMESPACE} get ingress aou-backend-${ENV_TAG}
else
  echo "attempts for helm upgrade are exhausted"; exit 1
fi
