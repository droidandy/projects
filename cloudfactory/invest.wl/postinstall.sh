#!/usr/bin/env bash
set -x

readonly SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

declare -a arr=("react" "react-native" "@react-native-community" "react-native-vector-icons" "react-native-interactable" "react-native-charts-wrapper"
"react-native-pager-view" "react-native-webview" "react-native-config" "@react-native-clipboard" "react-native-in-app-review"
"hermes-engine"
"mobx" "mobx-react" "tslib")

for i in "${arr[@]}"
do
  target="${SELF_DIR}/packages/app.mobile/node_modules/${i}"
  [ ! -d "$target" ] && ln -s "${SELF_DIR}/node_modules/${i}" "$target"
done
