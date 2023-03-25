#!/bin/bash

. /d/DEV/AOU/aou-backend/_sh/common.sh
load_dot_env

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

bad_start() {
  echo_r "Apollo server not launched"
  netstat -ano | findstr :3000
  sleep 20
}

check_env_presence "AWS_COGNITO_JWKS_CLIENT"
echo_g "Launch Apollo server.$w Working dir: $c$PWD"
#TS_NODE=true
#NODE_ENV=development
#node -r ts-node/register ./src/launch.ts || bad_start
#./node_modules/.bin/ts-node-dev --respawn --debounce 100 ./src/launch.ts
npm run dev
