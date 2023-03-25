#!/bin/bash

apply_migrations() {
  echo_g "Applying migrations"
  set +e
  node -r ts-node/register ./node_modules/typeorm/cli.js migration:run
  if [ $? -eq 0 ]; then
      echo ""
  else
      echo_r "Failed to apply migrations"
      /bin/echo -e "$r";
      read -p "Press any key to exit..."
      exit 1
  fi
  set -e
}
