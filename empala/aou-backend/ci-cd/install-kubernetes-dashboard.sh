#!/bin/sh

set -e

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.4.0/aio/deploy/recommended.yaml
kubectl apply -f kubernetes-dashboard-access.yaml