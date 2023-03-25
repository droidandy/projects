cd packages/app.mobile/android/
gradlew assembleDevelopmentDebug
gradlew --stop
adb uninstall expo.invest.mapp.development
adb install app/build/outputs/apk/development/debug/app-development-debug.apk
cd ../../..