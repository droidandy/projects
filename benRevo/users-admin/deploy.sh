#!/bin/bash
#
# Create a new production release and tag on master
#

# Make sure the repo has git flow setup
git flow init -d

# Start the git flow release process
git flow release start $1

# Change the version number in package.json
sed "s/.*\"version\":.*/\"version\":\"$1\",/" ./package.json > package.json.bak && mv package.json.bak package.json
sed "s/.*\"version\":.*/\"version\":\"$1\",/" ./webtask.json > webtask.json.bak && mv webtask.json.bak webtask.json

# Add the changed file
git add package.json
git add webtask.json

# Commit the package.json with the new version number
git commit -m "$1"

# Finish the release.  This merges to master and tags the branch
git flow release finish -m "$1" $1

# The next thing you'll tpyically want to do after this script is to:
# git push --all
# git push --tags
