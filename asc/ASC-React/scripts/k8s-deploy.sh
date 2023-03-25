#!/bin/sh
export KUBECONFIG=/home/ascdev/.kube/acsk8s.config
kubectl apply -f ../container/ascweb.yaml --record