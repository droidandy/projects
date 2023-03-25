#!/bin/sh
# Wait for Redis, used in Dockerfiles
# Usage:
#   ./wait-for-redis host port [max-ping-attempts]
#
# if max-ping-attempts is not given, 30 ping attempts are used by default

if [[ $# -le 1 ]] ; then
  echo "host and port are obligatory arguments" >&2; exit 1
fi
HOST=$1
PORT=$2
if [[ -z "$3" ]] ; then
  MAX_PING_ATTEMPTS=30
else
  MAX_PING_ATTEMPTS=$3
fi

echo "Start waiting for Redis fully start. Host '$HOST', port '$PORT'..."
echo "Try ping Redis... "
for ping_attempt in $(seq 1 $MAX_PING_ATTEMPTS)
do
  PONG=$(redis-cli -h $HOST -p $PORT ping | grep PONG)
  if [[ ! -z "$PONG" ]] ; then
    echo "Redis at host '$HOST', port '$PORT' fully started."
    exit 0
  fi
  sleep 1
done
echo "Exhausted attempts to wait for Redis at host '$HOST', port '$PORT'."
exit 1
