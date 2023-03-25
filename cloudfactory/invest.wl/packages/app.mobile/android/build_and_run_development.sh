./gradlew assembleDevelopmentDebug && \
./gradlew --stop && \
adb uninstall expo.invest.mapp.development && \
adb install ./app/build/outputs/apk/development/debug/app-development-debug.apk && \
adb shell am start -a android.intent.action.MAIN -n expo.invest.mapp.development/expo.invest.mapp.MainActivity
