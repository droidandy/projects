#!/bin/sh
# Use for clean install of Gitlab Runner in AWS EKS, perform this script and then install-gitlab-runner.sh
set -e

helm delete --namespace gitlab gitlab-runner