#!/bin/sh
# Checks whether current branch is behind default one, to be used ONLY in .gitlab-ci.yml

. ci-cd/common.sh

set -e

if [ "$CI_COMMIT_REF_PROTECTED" == "true" ]; then
  echo "Running job on protected reference, skip rebase check..."
else
  if [ "$SKIP_REBASE_CHECK"  == "true" ]; then
    echo "Skip rebase check due to SKIP_REBASE_CHECK=true..."
  else
    if $(git rev-parse --is-shallow-repository); then
      git fetch --unshallow origin +refs/heads/${CI_COMMIT_REF_NAME}:refs/remotes/origin/${CI_COMMIT_REF_NAME}
    else
      git fetch origin +refs/heads/${CI_COMMIT_REF_NAME}:refs/remotes/origin/${CI_COMMIT_REF_NAME}
    fi
    git fetch origin +refs/heads/${CI_DEFAULT_BRANCH}:refs/remotes/origin/${CI_DEFAULT_BRANCH}
    export N_COMMITS_BEHIND_DEFAULT=$(git rev-list --right-only --count origin/${CI_COMMIT_REF_NAME}..origin/${CI_DEFAULT_BRANCH})
    if [ "$N_COMMITS_BEHIND_DEFAULT" != "0" ]; then
      echo_r "ERROR: Current branch $y${CI_COMMIT_REF_NAME}$r is behind $y${CI_DEFAULT_BRANCH}$r by ${N_COMMITS_BEHIND_DEFAULT} commits, please make rebase first..."
      exit 1
    fi
  fi
fi
