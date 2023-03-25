import './extends';
import './moment.boot';

// см https://reactnavigation.org/docs/en/getting-started.html#install-into-an-existing-project
import 'react-native-gesture-handler';
// https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import 'react-native-get-random-values';
import { AppModule } from '../App.module';
import { fixAllowFontScaling } from './fixAllowFontScaling';
import { LogBox, Platform, UIManager } from 'react-native';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { RootComponent } from './RootComponent';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

LogBox.ignoreLogs([
  'Could not find image file',
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader requires main',
  'Module RNFetchBlob requires main',
  'Require cycle:',
  'Non-serializable',
]);


export function bootstrapper() {
  const appModule = new AppModule();
  IoC.moduleLoad(appModule);
  fixAllowFontScaling();
  return RootComponent;
}
