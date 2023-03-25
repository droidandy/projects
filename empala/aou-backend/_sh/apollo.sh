#!/bin/bash

. /d/DEV/AOU/aou-backend/_sh/common.sh
load_dot_env

APOLLO_PORT=3000

kill_process_using_apollo_port() {
  kill_process_using_port $APOLLO_PORT
}

launch_apollo_server_in_new_window() {
    echo_g "Launching Apollo server in a new window"
    eval "\"${GIT_BASH_EXE}\" ${_SH}/apollo-launch.sh &>/dev/null" &>/dev/null & disown;
}

wait_apollo_connection() {
  wait_for_port_connection $APOLLO_PORT 20
  if [ $? -eq 0 ]; then
    echo_g "Apollo server available (port: $APOLLO_PORT)"
  else
    echo_r "There is no connection to the Apollo server (port: $APOLLO_PORT)"
    read -p "Press any key to exit ..." -t 30
    exit 1;
  fi
}

