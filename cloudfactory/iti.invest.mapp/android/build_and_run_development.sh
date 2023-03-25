./gradlew assembleDevelopmentDebug && \
./gradlew --stop && \
adb uninstall iti.invest.mapp.development && \
adb install ./app/build/outputs/apk/development/debug/app-development-debug.apk && \
adb shell am start -a android.intent.action.MAIN -n iti.invest.mapp.development/iti.invest.mapp.MainActivity
