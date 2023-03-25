This README would normally document whatever steps are necessary to get your application up and running.

To run the mobile application on local in the emulator, please follow the steps below :

1) First install NodeJs. To install Ionic run the command "npm install -g ionic cordova" 
2) Go to the folder of the mobile app and then run "npm install" 
3) Open a cmd and going inside the app folder run the command "ionic cordova build android" to build apk for android 
4) Go to the folder "platforms\android\app\build\outputs\apk\release", you will find the Release apk.


platform/android/build.gradle
classpath 'com.google.gms:google-services:4.2.0'

platform/android/project.properties

cordova.system.library.1=com.android.support:support-v4:24.1.1+
cordova.gradle.include.1=cordova-plugin-firebase/kanvas-build.gradle
cordova.system.library.2=com.google.android.gms:play-services-tagmanager:+
cordova.system.library.3=com.google.firebase:firebase-core:+
cordova.system.library.4=com.google.firebase:firebase-messaging:17+
cordova.system.library.5=com.google.firebase:firebase-config:16+
cordova.system.library.6=com.google.firebase:firebase-perf:16.2.4
cordova.system.library.7=com.android.support:support-v4:24.1.1+
cordova.system.library.8=com.facebook.android:facebook-android-sdk:4.+
cordova.system.library.9=com.google.android.gms:play-services-auth:11.8.0
cordova.system.library.10=com.google.android.gms:play-services-identity:11.8.0
cordova.gradle.include.2=cordova-plugin-badge/kanvas-badge.gradle
cordova.system.library.11=com.android.support:support-v4:27.+
