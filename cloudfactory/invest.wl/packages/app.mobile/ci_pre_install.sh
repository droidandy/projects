#!/usr/bin/env bash
 set -x #echo on

# Задание кредов от git, чтобы можно было задавать зависимости в package.json
# по ссылкам на репозиторий: git+https://git.effectivetrade.ru вместо node_modules.private
# Тимсити вызывает скрипт напрямую, так как package.json/scripts/preinstall
# при выполнении `npm ci` в тимсити не вызывается перед загрузкой пакетов,
# см. https://github.com/npm/cli/issues/289

setup_git_creds() {
  echo "[CI_PRE_INSTALL] setup_git_creds..."
  if [[ -z "$GIT_USER" || -z "$GIT_PASSWORD" ]];
  then
    echo "[CI_PRE_INSTALL] GIT_USER/GIT_PASSWORD not specified"
  else
    echo "[CI_PRE_INSTALL] Replace creds to git.effectivetrade.ru in package-lock.json"
    sed -i.orig "s/\/\/git\.effectivetrade\.ru/\/\/${GIT_USER}:${GIT_PASSWORD}@git\.effectivetrade\.ru/g" package-lock.json
  fi
  echo "[CI_PRE_INSTALL] setup_git_creds done"
}

setup_git_creds
