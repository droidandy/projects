## OTE MOBILE

#### Tool Setup
```bash
sudo npm install -g react-native-cli
bundle install
brew install yarn
```

#### Project Setup
```bash
git pull git@github.com:GettUK/ote_app.git gett_ote_app
cd gett_ote_app && yarn
cd ios && pod install && cd ..
```

#### Development
Metro-bundler considered to be default bundler for this project.
If you'd like to use Haul instead, you still can run it manually

- `yarn ios` to launch the iOS simulator and Metro-bundler server
- `yarn android` to launch the Android emulator (but it should be open with Android Studio in advance)
- `yarn android --deviceId [ID]` to launch the Android device by ID (which could be found by `adb devices` command)
- `yarn start` or `yarn cold-start` to start Metro-bundler server manually
- Xcode should automatically launch haul server on run/build/archive

#### Versioning
##### iOS
Version of iOS builds consist of 'short version string' and 'bundle version'.

According to sprint number (1.16, e.g.) you should set major number 1 and minor - 16. So version string will be equal to sprint version 1.16.

As for bundle version - it is patch number of build (from 1 and more) and could be increased with new build deploment
##### Android
Version of Android build consist of `versionCode` and `versionNumber`.

The `versionCode` parameter shoul always be the bigger than previous for successful uploading to Google Play store. It's format includes minimal SDK version, major, minor and patch versions. E.q., 16011601 means, that current minimal SDK version is 16, major - 1, minor - 16 (so, the appropriate sprint number is 1.16), and patch - 1.

The `versionNumber` is formed from minor and major versions and is iqual to sprint number. If you'd like to have some production patch, which related to already released build, you should put prodPatch parameter to `/android/app/build.gradle` file.

#### Environment versions
- `node` - minimal supported - 10.4.1, recommended - 10.15.1
- `java / jdk` - 1.8.0_171
- `yarn` - 1.12.3
- `gradle` - minimal supported - 4.7, recommended - 5.0
- `pod` - 1.5.3
- `react-native-cli` - 2.0.1
- `fastlane` - 2.115.0

#### Fastlane

Setup:
- check installed fastlane version (`bundle exec fastlane -v`)
- copy `.env.example` file and rename it to `.env`
- fill all env variable

Remote control:
- setup and turn on vpn to Khakiv office
- connect via ssh to deployment machine
- execute build command

Usage:
- common use case is to run `bundle exec fastlane dev_builds` - will run tests, all checks, build ios/android with dev credentials, send ios build to testflight, send apk file to slack channel, send changelog to slack, create git tag with new version, create commit with version bumping
- for starting new sprint need to run `bundle exec fastlane reset_ios_build_number`, change `CFBundleShortVersionString` in `Info.plist`, update version in `app/build.gradle`
- for creating production build need to run  `bundle exec fastlane prod_builds`
- check more commands in `fastlane/README.md` or run `bundle exec fastlane` to select one

#### E2E tests
To launch iOS tests (iPhone device could be determined in package.json params):
- Use `Legacy Build System` (could be set in Xcode File -> Workspace Settings -> Build System)
- Make sure you have install `applesimutils` globaly: `brew tap wix/brew && brew install applesimutils`
- `yarn detox-build-ios`
- `yarn test:e2e:ios`

To launch Android tests:
- Install Pixel XL emulator with 27 API
- `export ANDROID_SDK_ROOT="/Users/{username}/Library/Android/sdk/"` for setting SDK root path
- `yarn detox-build-android` ('release' is required for avoiding warn messages overlaping, scroll event, e.g.)
- `yarn test:e2e:android`

#### Troubleshooting bundler
In order to start Metro server without previously cached transformation better to use `yarn clear-cache` command.
After resetting cache with this command, please run `yarn android` or `yarn ios` again.

#### Troubleshooting iOS
If your iOS run/build/archive fails:
```bash
git pull orgin dev
git reset --hard
rm -rf node_modules ios/Pods ios/build
yarn cache clean
yarn
cd ios && pod install && cd ..
```

The cli is broken once you have installed xcode 10.
To solve it run the following commands:
```bash
$ cd node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../
$ cd node_modules/react-native/third-party/glog-0.3.5/ && ../../scripts/ios-configure-glog.sh && cd ../../../../
```

#### Troubleshooting Android
If you get location permission error:
- Install Android emulator of api level 22 or less (Android 5.1 or less)

If you get error about missing `index.delta`:
- Press `Cmd + M` in emulator to bring up dev menu
- Go to `Dev Settings`
- Switch off the experimental `Use JS Deltas` flag
- Go back to the error and double press `R` to reload

#### Debugging
Use React Native Debugger instead react-devtools

Install React Native Debugger:
```
$ brew update && brew cask install react-native-debugger
```
Follow instruction:
https://facebook.github.io/react-native/docs/debugging

#### SVG converter
Before run you should:
 - You can use folder or single file.
 - Setup params in `scripts/SVGConverter/index.mjs` if necessary.
 - By default used `input` and `output` folders in `scripts/SVGConverter`. 
 - Put some svg files into `input` folder.
 
 ```
 $ yarn svg
 $ yarn svg [-d input directory] [-o output directory] [-f pathTofile]
 ```
 
 Check all generated .js files.
 If necessary you can add property such as `color` inside js files.

#### Minimal versions required

- `react-native-cli` - 2.0.1
- `cocoapods` - 1.4.0
- `yarn` - 1.3.2

#### Important points

- Be attentive with upgrade `react-native-svg`. Also check tappable bars on Statistic page on Android.
