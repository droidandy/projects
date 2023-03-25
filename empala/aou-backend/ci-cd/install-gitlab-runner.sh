#!/bin/bash
# Install Gitlab Runner into K8S cluster via helm
# Usage:
#   ./install-gitlab-runner.sh <runnerRegistrationToken> [<tags>]
#
# runnerRegistrationToken is to be taken from https://gitlab.com/empala/aou-backend/-/settings/ci_cd,
# click on Expand in Runners, Specific runners
# tags should be given like "eks, k8s", by default is "eks-dev, k8s-dev"
set -e

vercomp () {
    if [[ $1 == $2 ]]
    then
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]}))
        then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]}))
        then
            return 2
        fi
    done
    return 0
}

if [[ $# -le 1 ]] ; then
  echo "runnerRigistrationToken is an obilgatory argument" >&2; exit 1
fi
RUNNER_REGISTRATION_TOKEN=$1
TAGS=$2
if [[ -z "$TAGS" ]]; then
  TAGS="eks-dev, k8s-dev"
fi
TAGS=$(echo $TAGS | sed 's/,/\\,/')

full_path=$(realpath $0)
dir_path=$(dirname $full_path)

KUBECTL_VERSION=$( kubectl version --short | grep "Client Version" | sed 's/.*: v//')

kubectl apply -f $dir_path/gitlab-access.yaml
helm repo add gitlab https://charts.gitlab.io
set +e
vercomp $KUBECTL_VERSION "1.19"
VER_COMP_RESULT=$?
set -e
if [[ "$VER_COMP_RESULT" -eq "2" ]]; then
  kubectl create namespace gitlab --dry-run -o yaml | kubectl apply -f -
else
  kubectl create namespace gitlab --dry-run=client -o yaml | kubectl apply -f -
fi
helm upgrade --install --namespace gitlab -f $dir_path/gitlab-runner-values.yaml \
  --set runnerRegistrationToken="${RUNNER_REGISTRATION_TOKEN}" --set runners.tags="${TAGS}" \
  gitlab-runner gitlab/gitlab-runner
kubectl apply -f $dir_path/gitlab-runner-access.yaml