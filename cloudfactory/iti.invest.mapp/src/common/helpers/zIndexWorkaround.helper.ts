import { Platform } from 'react-native';

//TODO: remove me after https://github.com/facebook/react-native/issues/8968#ref-issue-254105906
export function zIndexWorkaround(val: number): any {
  return Platform.select<any>({
    ios: { zIndex: val },
    android: { elevation: val },
  });
}
