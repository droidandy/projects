#!/bin/bash

GIT_BASH_EXE="/c/Program Files/Git/git-bash.exe"
AOU_BACKEND="/d/DEV/AOU/aou-backend"
PRODUCTS="${AOU_BACKEND}/products"
_SH="${AOU_BACKEND}/_sh"
DOCKER_COMPOSE_EXE="/c/Program Files/Docker/Docker/resources/bin/docker-compose.exe"

set -e

c="\e[1;36m"; g="\e[1;32m"; r="\e[1;31m"; y="\e[1;33m"; w="\e[0m";
echo_g() { /bin/echo -e "$g$1$w";  };
echo_r() { /bin/echo -e "$r$1$w";  };
echo_c() { /bin/echo -e "$c$1$w";  };

exit_error() {
  if [[ -n "$1" ]]; then
    echo_r "$1";
  fi;
  exit 1;
};

check_env_presence() {
  for env_name in $1; do
    env_value=$(eval echo \$${env_name})
    if [[ -z $env_value ]]; then exit_error "No ENV$y ${env_name}$r specified"; fi
  done
}

runInBg() {
    eval "$@" &>/dev/null & disown;
}

load_dot_env() {
  if [ -f "${AOU_BACKEND}/.env" ]; then
      set -o allexport; source "${AOU_BACKEND}/.env"; set +o allexport
  fi
}

wait_for_port_connection() {
  local _PORT=$1
  local _TIMEOUT=${2:-15}
  set +e
  timeout 15 bash -c "until echo > /dev/tcp/localhost/$_PORT > /dev/null 2>&1; do sleep 0.5; echo \"waiting for port $_PORT ...\"; done" 2> /dev/null;

  bash -c "echo > /dev/tcp/localhost/$_PORT >/dev/null 2>/dev/null" > /dev/null 2>&1;
  if [ $? -eq 0 ]; then
      return 0
  else
      return 1
  fi
  set -e
}

get_pid_using_port() {
    netstat -ano | findstr :$1 | awk 'FNR=1 {print $5;exit}';
}

kill_process_using_port() {
  set +e
  local _PORT=$1
  netstat -ano | findstr :$_PORT
  local _PROCESS
  _PROCESS=$(get_pid_using_port $_PORT)
  if [[ "$_PROCESS" == "0" ]] ; then
      _PROCESS=""
  fi
  if [[ -n $_PROCESS ]] ; then
    echo_c "Found process $_PROCESS, occupying port $_PORT. Kill it..."
    set +e
    /c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe Stop-Process -ID $_PROCESS -Force
    set -e
    # Checking if the process is killed
    _PROCESS=$(get_pid_using_port $_PORT)
    if [[ "$_PROCESS" == "0" ]] ; then
        _PROCESS=""
    fi
    if [[ -n $_PROCESS ]] ; then
        echo_r "The $_PROCESS process occupying port $_PORT is alive..."
        read -p "Press any key to exit..." -t 30
        exit 1;
    else
        echo_g "Process killed"
    fi
  fi
  set -e
}
