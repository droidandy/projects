./gradlew assembleRelease && \
./gradlew --stop && \
#adb uninstall univer.invest.mapp && \
#adb install ./app/build/outputs/apk/development/debug/app-development-debug.apk && \
#adb shell am start -a android.intent.action.MAIN -n univer.invest.mapp.development/univer.invest.mapp.MainActivity
