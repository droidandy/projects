@echo off
set list=react react-native @react-native-community react-native-vector-icons react-native-interactable react-native-pager-view react-native-webview react-native-config @react-native-clipboard react-native-in-app-review react-native-charts-wrapper hermes-engine mobx mobx-react tslib

echo Create Simlinks
cd .\packages\app.mobile\node_modules\
(for %%a in (%list%) do (
   mklink /d .\%%a ..\..\..\node_modules\%%a
))
cd ..\..\..\

echo Fix "react-native-interactable"
cd node_modules\react-native-interactable
del android
mklink /d android lib\android

echo END
cd ..\..
