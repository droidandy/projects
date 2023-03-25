#!/bin/sh
# Checks the code and aborts the build process if there are ESLint errors. To be used ONLY in .gitlab-ci.yml

. ci-cd/common.sh

set -e

echo_g "Start ESLint..."
/bin/echo -e "$r"
./node_modules/.bin/eslint -c .eslintrc.js --ext .js,.ts ./products
echo_g "Passed ESLint check"

