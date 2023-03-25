#!/bin/sh
# Wait for Hasura, used in Dockerfiles
# Usage:
#   ./wait-for-hasura hasura-endpoint [max-ping-attempts]
#
# if max-ping-attempts is not given, 30 ping attempts are used by default

if [[ $# -lt 1 ]] ; then
  echo "hasura-endpoint is an obligatory argument" >&2; exit 1
fi
HASURA_ENDPOINT=$1
if [[ -z "$2" ]] ; then
  MAX_PING_ATTEMPTS=30
else
  MAX_PING_ATTEMPTS=$2
fi

echo "Start waiting for Hasura fully start. Hasura endpoint '$HASURA_ENDPOINT'..."
echo "Try ping Hasura... "
for ping_attempt in $(seq 1 $MAX_PING_ATTEMPTS)
do
  if curl ${HASURA_ENDPOINT}/healthz > /dev/null 2> /dev/null; then
    echo "Hasura at endpoint '$HASURA_ENDPOINT' fully started."
    exit 0
  fi
  sleep 1
done
echo "Exhausted attempts to wait for Hasura at endpoint '$HASURA_ENDPOINT'."
exit 1
