git checkout develop
git pull --rebase
git checkout master
git merge develop
git push
git checkout develop
cap deploy
