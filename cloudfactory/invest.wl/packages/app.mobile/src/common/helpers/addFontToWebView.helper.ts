import { Platform } from 'react-native';

export function addFontToWebView(nameFont: string) {
  return {
    fontUrl: Platform.OS === 'ios' ? nameFont : `file:///android_asset/fonts/${nameFont}`,
  };
}
