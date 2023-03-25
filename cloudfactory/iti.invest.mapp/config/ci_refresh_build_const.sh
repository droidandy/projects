#!/bin/bash

set -xe

###
# save build-time env variables (preBuild script)

SELF_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


CI_BUILD_NUMBER=${CI_BUILD_NUMBER:='0'}
CI_BUILD_REVISION=${CI_BUILD_REVISION:='NA'}
CI_BUILD_DATETIME=${CI_BUILD_DATETIME:=`date -u +"%Y-%m-%dT%H:%M:%SZ"`}

CI_BUILD_VERSION_PREFIX="0.0.2"
CI_BUILD_VERSION_FULL="${CI_BUILD_VERSION_PREFIX} (${CI_BUILD_NUMBER})"

echo "Detected env vars: CI_BUILD_VERSION_FULL=${CI_BUILD_VERSION_FULL}, CI_BUILD_REVISION=${CI_BUILD_REVISION}, CI_BUILD_DATETIME=${CI_BUILD_DATETIME}"

### env file version: 'x.y.z (BUILD_NUMBER)'
sed -i -e "s/CI_BUILD_VERSION\=.*/CI_BUILD_VERSION\=${CI_BUILD_VERSION_FULL}/" ${SELF_DIR}/*.env
sed -i -e "s/CI_BUILD_REVISION\=.*/CI_BUILD_REVISION\=${CI_BUILD_REVISION}/" ${SELF_DIR}/*.env
sed -i -e "s/CI_BUILD_DATETIME\=.*/CI_BUILD_DATETIME\=${CI_BUILD_DATETIME}/" ${SELF_DIR}/*.env

### js version  (npm require semver): x.y.z+BUILD_NUMBER
sed -i -e 's/\"version\".*/\"version\"\:\"'"${CI_BUILD_VERSION_PREFIX}\+${CI_BUILD_NUMBER}\",/" ${SELF_DIR}/../package.json
### only at 3-th line
sed -i -e '3s/\"version\".*/\"version\"\: \"'"${CI_BUILD_VERSION_PREFIX}\+${CI_BUILD_NUMBER}\",/" ${SELF_DIR}/../package-lock.json

### android version (\s - not matching on macos)
sed -i -e "s/def gAppVersionName =.*/def gAppVersionName = \"${CI_BUILD_VERSION_PREFIX}\"/" ${SELF_DIR}/../android/app/build.gradle

### iOS version
### if not IOS - change the ../ios/application/Info.plist:CFBundleShortVersionString
if [ -e /usr/libexec/PlistBuddy ]; then
find ${SELF_DIR}/../ios/application -name *Info.plist -exec /usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${CI_BUILD_NUMBER}" {} \;
find ${SELF_DIR}/../ios/application -name *Info.plist -exec /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${CI_BUILD_VERSION_PREFIX}" {} \;
fi
