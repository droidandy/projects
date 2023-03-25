# DVGAutomotive
## Install global packages 
```bash
npm install -g yo generator-rn-toolbox
```
## Install
```bash
yarn install
```
## Build release apk for Android
```bash
cd android
./gradlew assembleRelease
```
## Testing the release build of your app 
```bash
react-native run-android --variant=release
```
## Developer mode on device
```bash
react-native run-ios --device
```
```bash
react-native run-android
```
 ## Set Icons
 ```bash
yo rn-toolbox:assets --icon ./icon.jpg
yo rn-toolbox:assets --splash ./splash.jpg
 ```
For splash use a square image 2208x2208
