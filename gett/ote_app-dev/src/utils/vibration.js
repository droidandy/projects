import { Vibration } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import { isIOS } from 'utils';

export default function vibrate({ pattern, type }) {
  if (isIOS) {
    ReactNativeHaptic.generate(type);
  } else {
    Vibration.vibrate(pattern);
  }
}
