#!/bin/bash

args="$*";
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -ncd|--no-clear-docker)
        NO_CLEAR_DOCKER="1"
        shift;;
        -nwe|--no-wait-at-end)
        NO_WAIT_AT_END="1"
        shift;;
        *) shift;;
    esac
done
set -- $args

. /d/DEV/AOU/aou-backend/_sh/common.sh
. /d/DEV/AOU/aou-backend/_sh/docker-work.sh
. /d/DEV/AOU/aou-backend/_sh/migrations.sh
. /d/DEV/AOU/aou-backend/_sh/apollo.sh

set +e

load_dot_env
NODE_ENV=development
check_env_presence "AWS_COGNITO_JWKS_CLIENT"

cd "${AOU_BACKEND}/products/core-be"
echo_c "Working dir: $PWD"

if [ -z $NO_CLEAR_DOCKER ]; then
  docker_clear
  run_docker
fi;
wait_for_db_connection
wait_for_hasura_connection

sleep 1
apply_migrations

kill_process_using_apollo_port
launch_apollo_server_in_new_window
wait_apollo_connection

echo_g "Applying hasura metadata"
hasura metadata apply --endpoint http://localhost:8080 --admin-secret myadminsecretkey --project hasura

if [ -z $NO_WAIT_AT_END ]; then
  /bin/echo -e "$g";
  read -p "Press any key to close the window ..." -t 30
fi;
exit 0
