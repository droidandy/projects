#!/usr/bin/env bash
# This script is required to be present for the VSTS cordova build command to work properly
# npm run build
echo "from /scripts/build.sh: skipped build since we should have already built webpack to use with app via earlier VSTS task."