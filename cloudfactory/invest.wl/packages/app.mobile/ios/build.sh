#!/bin/bash
set -x #echo on
set -e

### vars
CI_BUILD_NUMBER=${CI_BUILD_NUMBER:=0}
BUILD_TARGET=${BUILD_TARGET:='staging'}

WORK_DIR=${HOME}/work
PODS_ROOT="Pods"

CERT_FILE="sign/${BUILD_TARGET}.p12"
CERT_PASSWORD=''

PROVISION_FILE="sign/${BUILD_TARGET}.mobileprovision"
XCODE_WORKSPACE="application.xcworkspace"
XCODE_SCHEME="application.${BUILD_TARGET}"

XCODE_BUILD_CONFIGURATION_firstChar=`echo $BUILD_TARGET|cut -c1|tr [a-z] [A-Z]`
XCODE_BUILD_CONFIGURATION_restChars=`echo $BUILD_TARGET|cut -c2-`
XCODE_BUILD_CONFIGURATION="${XCODE_BUILD_CONFIGURATION_firstChar}${XCODE_BUILD_CONFIGURATION_restChars}Release"

KEYCHAIN_PATH="${WORK_DIR}/_temp/ios_signing_temp.keychain"
KEYCHAIN_PASSWORD='123456'
PROVISION_UUID='This value setup in runtime'

DSYM_ZIP_PATH=${WORK_DIR}/output/build/export/symbols.zip
XCARCHIVE_ZIP_PATH=${WORK_DIR}/output/build/export/application.xcarchive.zip

### save this app to artifacts as '.xcarchive.zip' file
OUTPUT_XCARCHIVE=${OUTPUT_XCARCHIVE:='NO'}
### save this app to artifacts as '.ipa' file
OUTPUT_IPA=${OUTPUT_IPA:='YES'}
### save this app dSYM to artifacts as zip file
OUTPUT_DSYM=${OUTPUT_DSYM:='YES'}

# TODO
if [ "$BUILD_TARGET" == "production" ] ; then
  OUTPUT_IPA='NO'
  OUTPUT_XCARCHIVE='YES'
fi

XCODE_APP_NAME="application"
APP_PATH="${WORK_DIR}/output/build/archive/${XCODE_SCHEME}.xcarchive/Products/Applications/${XCODE_APP_NAME}.app"
GOOGLE_SERVICE_INFO_PATH="${APP_PATH}/GoogleService-Info.plist"

clean() {
    security delete-keychain ${KEYCHAIN_PATH} || true
    rm -rf ${WORK_DIR}
}

__prepare_provision() {
  local TMP_PLIST_FILE="${WORK_DIR}/_temp/_xcodetasktmp.plist"

    echo '[INFO] Show X.509 certificate information'
    openssl pkcs12 -in ${CERT_FILE} -nokeys -passin pass: | openssl x509 -noout -fingerprint
    openssl pkcs12 -in ${CERT_FILE} -nokeys -passin pass: | openssl x509 -noout -subject

    echo "[INFO] Create Keychain with path [${KEYCHAIN_PATH}]"
    security create-keychain -p ${KEYCHAIN_PASSWORD} ${KEYCHAIN_PATH}
    security set-keychain-settings -lut 7200 ${KEYCHAIN_PATH}
    security unlock-keychain -p ${KEYCHAIN_PASSWORD} ${KEYCHAIN_PATH}

    echo "[INFO] Import X.509 cert into keychain with path [${KEYCHAIN_PATH}]"
    security import ${CERT_FILE} -P "${CERT_PASSWORD}" -A -t cert -f pkcs12 -k ${KEYCHAIN_PATH}
    security list-keychain -d user
    security list-keychain -d user -s ${KEYCHAIN_PATH} ${HOME}/Library/Keychains/login.keychain-db
    security list-keychain -d user

    echo "[INFO] Import provision profile file [${PROVISION_FILE}]"
    rm -f TMP_PLIST_FILE
    security cms -D -i ${PROVISION_FILE} > ${TMP_PLIST_FILE}
    PROVISION_UUID=$(/usr/libexec/PlistBuddy -c 'Print UUID' ${TMP_PLIST_FILE})
    echo "[INFO] --> PROVISION_UUID=[${PROVISION_UUID}]"
    rm -f ${TMP_PLIST_FILE}
    cp -f ${PROVISION_FILE} "${HOME}/Library/MobileDevice/Provisioning Profiles/${PROVISION_UUID}.mobileprovision"
}

__clean_provision() {
    echo "[INFO] cleanup (remove provision profile and keychain)"
    rm -f "${HOME}/Library/MobileDevice/Provisioning Profiles/${PROVISION_UUID}.mobileprovision"
    security delete-keychain ${KEYCHAIN_PATH} || true
}

pod_install() {
    echo '[INFO] ---POD INSTALL BEGIN---'

    pod --version
    pod install --repo-update

    echo '[INFO] ---POD INSTALL END---'
}

build() {
    echo '[INFO] ---BUILD BEGIN---'
    local TMP_PLIST_FILE="${WORK_DIR}/_temp/_xcodetasktmp.plist"
    local TMP_EXPORT_PLIST_FILE="${WORK_DIR}/_temp/_XcodeTaskExportOptions.plist"
    local XCODE_PROVISION_CONTAINS_DEVICES="NA"
    local CODE_SIGNING_REQUIRED="$OUTPUT_IPA"

    if [ "$OUTPUT_IPA" = "YES" ]; then
        __prepare_provision
    fi

    echo "[INFO] Set 'CFBundleVersion' value in all Info.plist files to [${CI_BUILD_NUMBER}]"
    find . -name *Info.plist -exec /usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${CI_BUILD_NUMBER}" {} \;

    echo "[INFO] xcodebuild::cleanup"
    mkdir -p ${WORK_DIR}/output/build/export

    local XCODEBUILD_ARGS=""
    local XCODE_VERSION_STR=$(xcodebuild -version|head -1)
    echo "[INFO] xcode version: ${XCODE_VERSION_STR}"
    local XCODE_VERSION_MAJOR=$(echo $XCODE_VERSION_STR | sed -E 's/^[^0-9]*([0-9]+).*$/\1/')
    echo "[INFO] xcode version (major number): ${XCODE_VERSION_MAJOR}"
    if [ "$XCODE_VERSION_MAJOR" -gt "9" ]; then
      echo "[WARN] xcode version > 9, so pass -UseModernBuildSystem=NO to xcodebuild"
      echo "[WARN] please upgrade after https://github.com/facebook/react-native/issues/19573"
      XCODEBUILD_ARGS="-UseModernBuildSystem=NO"
    fi

    if [ "$OUTPUT_IPA" != "YES" ]; then
        XCODEBUILD_ARGS="$XCODEBUILD_ARGS CODE_SIGN_IDENTITY= CODE_SIGNING_REQUIRED=NO"
    fi

    xcodebuild -sdk iphoneos -workspace ${XCODE_WORKSPACE} -scheme ${XCODE_SCHEME} -derivedDataPath ${WORK_DIR}/output/build/derivedData -configuration ${XCODE_BUILD_CONFIGURATION} clean \
        DSTROOT=${WORK_DIR}/output/build/build.dst \
        OBJROOT=${WORK_DIR}/output/build/build.obj \
        SYMROOT=${WORK_DIR}/output/build/build.sym \
        SHARED_PRECOMPS_DIR=${WORK_DIR}/output/build/build.pch

    echo "[INFO] xcodebuild::extract APP_NAME"
    echo "[INFO] --> XCODE_APP_NAME=[${XCODE_APP_NAME}]"

    echo "[INFO] tune BUNDLE_CONFIG env variable (used in .../node_modules/react-native/.../react-native-xcode.sh)"
    export BUNDLE_CONFIG="metro.config.js --sourcemap-output ./index.ios.map"

    echo "[INFO] xcodebuild::archive"
    xcodebuild -workspace ${XCODE_WORKSPACE} -scheme ${XCODE_SCHEME} archive -sdk iphoneos \
        -archivePath ${WORK_DIR}/output/build/archive/${XCODE_SCHEME} \
        -derivedDataPath ${WORK_DIR}/output/build/derivedData \
        -configuration ${XCODE_BUILD_CONFIGURATION} ${XCODEBUILD_ARGS}

    if [ "$OUTPUT_IPA" = "YES" ]; then
        echo "[INFO] Show archive provision information"
        security cms -D -i ${WORK_DIR}/output/build/archive/${XCODE_SCHEME}.xcarchive/Products/Applications/${XCODE_APP_NAME}.app/embedded.mobileprovision > ${TMP_PLIST_FILE}
        /usr/libexec/PlistBuddy -c 'Print ProvisionsAllDevices' ${TMP_PLIST_FILE} || true
        /usr/libexec/PlistBuddy -c 'Print Entitlements:get-task-allow' ${TMP_PLIST_FILE} || true
        /usr/libexec/PlistBuddy -c 'Print ProvisionedDevices' ${TMP_PLIST_FILE} || true

        if /usr/libexec/PlistBuddy -c 'Print ProvisionedDevices' ${TMP_PLIST_FILE} ; then
            XCODE_PROVISION_CONTAINS_DEVICES='YES'
        else
            XCODE_PROVISION_CONTAINS_DEVICES='NO'
        fi
        rm -f ${TMP_PLIST_FILE}


        echo "[INFO] Create and setup export .plist file in [${TMP_EXPORT_PLIST_FILE}]"
        /usr/libexec/PlistBuddy -c 'Clear' ${TMP_EXPORT_PLIST_FILE} || true
        if [ "$XCODE_PROVISION_CONTAINS_DEVICES" = "YES" ]; then
            /usr/libexec/PlistBuddy -c 'Add method string ad-hoc' ${TMP_EXPORT_PLIST_FILE}
        else
            /usr/libexec/PlistBuddy -c 'Add method string app-store' ${TMP_EXPORT_PLIST_FILE}
        fi

        /usr/libexec/PlistBuddy -c 'Add signingStyle string manual' ${TMP_EXPORT_PLIST_FILE}
        /usr/libexec/PlistBuddy -c 'Add provisioningProfiles dict' ${TMP_EXPORT_PLIST_FILE}

        echo "[INFO] Extract [Name] value from archive [embedded.mobileprovision] file"
        security cms -D -i ${WORK_DIR}/output/build/archive/${XCODE_SCHEME}.xcarchive/Products/Applications/${XCODE_APP_NAME}.app/embedded.mobileprovision > ${TMP_PLIST_FILE}
        local PROVISION_NAME=$(/usr/libexec/PlistBuddy -c 'Print Name' ${TMP_PLIST_FILE})
        echo "[INFO] --> PROVISION_NAME=[${PROVISION_NAME}]"
        rm -f ${WORK_DIR}/_temp/_xcodetasktmp.plist

        echo "[INFO] Extract [CFBundleIdentifier] value from archive [Info.plist] file"
        local BUNDLE_ID=$(/usr/libexec/PlistBuddy -c 'Print CFBundleIdentifier' ${WORK_DIR}/output/build/archive/${XCODE_SCHEME}.xcarchive/Products/Applications/${XCODE_APP_NAME}.app/Info.plist)
        echo "[INFO] --> BUNDLE_ID=[${BUNDLE_ID}]"

        echo "[INFO] Add entity [provisioningProfiles:${BUNDLE_ID}] with value [${PROVISION_NAME}] to export plist file [${TMP_EXPORT_PLIST_FILE}]"
        /usr/libexec/PlistBuddy -c "Add provisioningProfiles:${BUNDLE_ID} string ${PROVISION_NAME}" ${TMP_EXPORT_PLIST_FILE}

        echo "[INFO] xcode::export"
        xcodebuild -exportArchive -archivePath ${WORK_DIR}/output/build/archive/${XCODE_SCHEME}.xcarchive \
            -exportPath ${WORK_DIR}/output/build/export/${XCODE_SCHEME} \
            -exportOptionsPlist ${TMP_EXPORT_PLIST_FILE} \
                    -configuration ${XCODE_BUILD_CONFIGURATION}
    fi

    if [ "$OUTPUT_DSYM" = "YES" ]; then
        echo "[INFO] zip dSYM"
        cd ${WORK_DIR}/output/build/archive/${XCODE_SCHEME}.xcarchive/dSYMs && zip -r -9 -X ${DSYM_ZIP_PATH} * && cd -
    fi

    if [ "$OUTPUT_XCARCHIVE" = "YES" ]; then
        echo "[INFO] zip .xcarchive"
        cd ${WORK_DIR}/output/build/archive/ && zip -r -9 -X ${XCARCHIVE_ZIP_PATH} ${XCODE_SCHEME}.xcarchive && cd -
    fi

    echo "[INFO] move js sourcemaps to output/build/export directory"
    mv ../index.ios.map ${WORK_DIR}/output/build/export

    __clean_provision

    #TODO: lsof -n -i4TCP:8081 | sed '1 d' | awk '{print $2}' | xargs kill -9 || true
    echo '[INFO] ---BUILD END---'
}

fabric_upload(){
    # Загрузка в fabric только для IPA, архив не грузим
    if [ "$OUTPUT_IPA" = "YES" ]; then
      __prepare_provision

      echo "[INFO] Firebase: upload dSYM"
      ./${PODS_ROOT}/FirebaseCrashlytics/upload-symbols -gsp ${GOOGLE_SERVICE_INFO_PATH} -p ios ${DSYM_ZIP_PATH}

      # не нужно загружать бинарник прода в firebase
      if [ "$BUILD_TARGET" != "production" ]; then
        firebase_upload
      fi

      __clean_provision
    fi
}

firebase_upload(){
    echo "[INFO] xcodebuild::extract XCODE_APP_NAME"
    echo "[INFO] --> XCODE_APP_NAME=[${XCODE_APP_NAME}]"

    local FIREBASE_TOKEN=${FIREBASE_TOKEN}

    local FIREBASE_DISTRIBUTION_GROUPS=`sed -nE 's/^FIREBASE_DISTRIBUTION_GROUPS\=(.*)$/\1/p' ../config/${BUILD_TARGET}.ios.env`
    echo "[INFO] --> FIREBASE_DISTRIBUTION_GROUPS=[${FIREBASE_DISTRIBUTION_GROUPS}]"

    # Ipa теперь берём как первый ipa файл из export папки
    local IPA_PATH=$(ls -1 ${WORK_DIR}/output/build/export/${XCODE_SCHEME}/*.ipa | head -n 1)
    echo "[INFO] IPA_PATH=${IPA_PATH}"

    echo "[INFO] Extract [GOOGLE_APP_ID] value from archive [GoogleService-Info.plist] file"
    local GOOGLE_APP_ID=$(/usr/libexec/PlistBuddy -c 'Print GOOGLE_APP_ID' ${GOOGLE_SERVICE_INFO_PATH})
    echo "[INFO] --> GOOGLE_APP_ID=[${GOOGLE_APP_ID}]"

    echo "[INFO] Firebase: Upload ipa to firebase appdistribution:distribute"
    # https://firebase.google.com/docs/app-distribution/ios/distribute-cli#distribute
    npm run deploy:ios:beta -- appdistribution:distribute ${IPA_PATH} --app ${GOOGLE_APP_ID} --groups ${FIREBASE_DISTRIBUTION_GROUPS} --token ${FIREBASE_TOKEN}
}

testflight_upload(){
    echo "[INFO] Testflight: upload IPA using fastlane"

    # Ipa теперь берём как первый ipa файл из export папки
    local IPA_PATH=$(ls -1 ${WORK_DIR}/output/build/export/${XCODE_SCHEME}/*.ipa | head -n 1)
    echo "[INFO] IPA_PATH=${IPA_PATH}"

    APP_ID_IOS=`sed -nE 's/^APP_ID_IOS\=(.*)$/\1/p' ../config/${BUILD_TARGET}.ios.env`

    ######
    ## require fastlane (see: https://fastlane.tools)
    ##
    ## prereq:
    ##  1) sudo gem install fastlane -NV
    ##  2) fastlane fastlane-credentials add --username tishinov@effectivetrade.ru
    ##  also CI setup envs: CI_TESTFLIGHT_TESTERS
    #####
    fastlane pilot upload --username "${CI_TESTFLIGHT_LOGIN}" \
                          --ipa "${IPA_PATH}" \
                          --changelog "${CI_TESTFLIGHT_CHANGELOG}" \
                          --team_name "${CI_TESTFLIGHT_TEAM_NAME}" \
                          --distribute_external \
                          --verbose
}


SECONDS=0
case "$1" in
        build)
            pod_install
            build
            ;;

        fabric_upload)
            fabric_upload
            ;;

        firebase_upload)
            firebase_upload
            ;;

        testflight_upload)
            testflight_upload
            ;;

        clean)
            clean
            ;;

        rebuild)
            clean
            pod_install
            build
            ;;

        *)
            echo $"Usage: $0 {clean|build|rebuild|fabric_upload|firebase_upload|testflight_upload}"
            exit 1

esac
echo "[INFO] Elapsed: $(($SECONDS / 3600))hrs $((($SECONDS / 60) % 60))min $(($SECONDS % 60))sec"
