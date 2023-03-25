#!/bin/sh
echo "Cordova version: " cordova --version
cordova platform add android
cordova build android
cp -R $BUILD_SOURCESDIRECTORY/platforms/android/build/outputs/apk/ $BUILD_STAGINGDIRECTORY