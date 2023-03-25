import { ISConfigSource } from '@invest.wl/system';
import RNConfig from 'react-native-config';

const REGEXP_MASK = /\%(.*?)\%/g;

function decodeMacros(str: string): string {
  if (str.replace) {
    return str.replace(REGEXP_MASK, (mask, value) => {
      return RNConfig[value] ? decodeMacros(RNConfig[value]) : mask;
    });
  }
  return str;
}

class ReactNativeConfig implements ISConfigSource {
  constructor() {
    Object.keys(RNConfig).forEach((key) => {
      const decodedValue = decodeMacros(RNConfig[key]);
      // @ts-ignore
      this[key] = decodedValue;
    });
  }
}

export const SConfigMobileSource: ISConfigSource = new ReactNativeConfig();
