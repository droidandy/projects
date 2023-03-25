#!/bin/bash

. /d/DEV/AOU/aou-backend/_sh/common.sh
load_dot_env

docker_clear() {
  set +e
  echo_g "Stop all containers"
  docker container stop $(docker container ls -aq)
  echo_g "Deleting all containers"
  docker container rm $(docker container ls -aq)
  echo_g "Removing all volumes"
  docker volume rm $(docker volume ls -qf dangling=true)
  set -e
}

run_docker() {
  set +e
  echo_g "Run docker-compose"
  "$DOCKER_COMPOSE_EXE" \
  --env-file $AOU_BACKEND/.env \
  -f $PRODUCTS/core-be/docker-compose.yml \
  -f $PRODUCTS/morningstar-datagrabber/docker-compose.yml \
  -f $PRODUCTS/apex-ext-datagrabber/docker-compose.yml \
  -p CBE-MS-APEX up -d
  set -e
}

wait_for_db_connection() {
  local _PORT=7432
  wait_for_port_connection $_PORT 20
  if [ $? -eq 0 ]; then
    echo_g "DB connection established (port: $_PORT)"
  else
    echo_r "There is no connection to the DB (port: $_PORT)"
    read -p "Press any key to exit ..." -t 30
    exit 1;
  fi
}

wait_for_hasura_connection() {
  local _PORT=8080
  wait_for_port_connection $_PORT 20
  if [ $? -eq 0 ]; then
    echo_g "Hasura connection established (port: $_PORT)"
  else
    echo_r "There is no connection to the Hasura (port: $_PORT)"
    read -p "Press any key to exit ..." -t 30
    exit 1;
  fi
}
