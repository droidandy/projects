#!/bin/sh
# Wait for PostgreSQL, used in Dockerfiles
# Usage:
#   ./wait-for-postgresql host port dbname user [max-ping-attempts]
#
# if max-ping-attempts is not given, 30 ping attempts are used by default

if [[ $# -le 1 ]] ; then
  echo "host, port are obligatory arguments" >&2; exit 1
fi
HOST=$1
PORT=$2
DBNAME=$3
USER=$4
if [[ -z "$5" ]] ; then
  MAX_PING_ATTEMPTS=30
else
  MAX_PING_ATTEMPTS=$5
fi

echo "Start waiting for PostgreSQL fully start. Host '$HOST', port '$PORT', dbname '$DBNAME', user '$USER'..."
echo "Try ping PostgreSQL... "
for ping_attempt in $(seq 1 $MAX_PING_ATTEMPTS)
do
  if pg_isready -h ${HOST} -p ${PORT} -d ${DB_NAME} -U ${USER} > /dev/null 2> /dev/null; then
    echo "PostgreSQL at host '$HOST', port '$PORT', dbname '$DBNAME', user '$USER' fully started."
    exit 0
  fi
  sleep 1
done
echo "Exhausted attempts to wait for PostgreSQL at host '$HOST', port '$PORT', dbname '$DBNAME', user $USER'."
exit 1
