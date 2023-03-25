import * as Font from 'expo-font';
import { theme } from './theme';

export const fetchFonts = (): Promise<void> =>
  Font.loadAsync({
    [theme.fonts.normal]: require('../resources/fonts/SF-UI-Text-Regular.ttf'),
    [theme.fonts.light]: require('../resources/fonts/SF-UI-Text-Light.ttf'),
    [theme.fonts.productHeading]: require('../resources/fonts/SFProDisplay-Semibold.ttf'),
  });
