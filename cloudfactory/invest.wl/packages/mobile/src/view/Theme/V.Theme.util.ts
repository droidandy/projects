import { memoizeDeep } from '@invest.wl/common';
import { TVThemeColorValue } from '@invest.wl/view';
import Color from 'color';
import { Dimensions, Platform, StyleSheet, ViewStyle } from 'react-native';

export type TVThemeStyleLayoutExtractor<TP> = <P extends Partial<TP>>(style: P) => {
  layoutStyle: Partial<TP>; style: Omit<P, keyof Partial<TP>>;
};

export const SMALL_SCREEN_HEIGHT = 640;
export const SMALL_SCREEN_WIDTH = 350;
export const DimensionsWidth = Dimensions.get('window').width;
export const DimensionsHeight = Dimensions.get('window').height;

export function styleFactory<T extends(...args: any[]) => any>(func: T): T {
  return memoizeDeep(func);
}

export function colorAlpha(color: string, alpha: number): string {
  return Color(color).alpha(alpha).string();
}

export function isColor(str?: string): boolean {
  return !!str && str[0] === '#';
}

/**
 * Производит наложение цвета foreground с прозрачностью alpha на цвет background.
 * Полученный цвет не содержит alpha-канала.
 */
export const mixColors = memoizeDeep((background?: string, foreground?: string, alpha?: number): string =>
  new Color(background).mix(new Color(foreground), alpha).hex(),
);

export const themeStyle = StyleSheet.create({
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  jcSB: { justifyContent: 'space-between' },
  jcSA: { justifyContent: 'space-around' },
  jcC: { justifyContent: 'center' },
  jcFS: { justifyContent: 'flex-start' },
  jcFE: { justifyContent: 'flex-end' },
  aiC: { alignItems: 'center' },
  aiFE: { alignItems: 'flex-end' },
  hitSlop16: { top: 16, bottom: 16, right: 16, left: 16 },
  hitSlopTB16: { top: 16, bottom: 16, right: 0, left: 0 },
  absFill: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  txtCenter: { textAlign: 'center' },
  txtRight: { textAlign: 'right' },
});

// TODO: refact!
export const themeSpaces = {
  xs: 2,
  sm: 4,
  sm_xs: 4 + 2, // 6
  md: 8,
  md_xs: 8 + 2, // 10
  md_sm: 8 + 4, // 12
  lg: 16,
  lg_xs: 16 + 2, // 18
  lg_sm: 16 + 4, // 20
  lg_md: 16 + 8, // 24
  xl: 32,
  xl_md: 32 + 8, // 40
  xl_lg: 32 + 16, // 48
};

const deviceHeight = DimensionsHeight;
const deviceWidth = DimensionsWidth;
export const fontScaleFactor = deviceWidth < SMALL_SCREEN_WIDTH ? 0.8 : 1;
export const isDeviceNarrow = deviceWidth <= SMALL_SCREEN_WIDTH || deviceHeight <= SMALL_SCREEN_HEIGHT;

// см. https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
export function isIphoneXGeneration() {
  return (
    Platform.OS === 'ios' &&
    !(Platform as any).isPad &&
    !(Platform as any).isTVOS &&
    (
      (deviceWidth === 375 && deviceHeight === 812 || deviceWidth === 812 && deviceHeight === 375) || // iPhone X, Xs
      (deviceWidth === 414 && deviceHeight === 896 || deviceWidth === 896 && deviceHeight === 414) // iPhone Xr, Xs Max
    )
  );
}

export class VThemeUtil {
  public static colorPick(color?: TVThemeColorValue | TVThemeColorValue[]): TVThemeColorValue | undefined {
    return Array.isArray(color) ? color[0] : color;
  }
}

interface IVThemeStyleLayout extends Pick<ViewStyle, 'flex' | 'flexDirection' | 'flexGrow' | 'flexShrink' |
'alignSelf' | 'width' | 'height' |
'margin' | 'marginLeft' | 'marginTop' | 'marginBottom' | 'marginRight' |
'position' | 'left' | 'right' | 'top' | 'bottom'> {

}

export const extractStyleLayout: TVThemeStyleLayoutExtractor<IVThemeStyleLayout> = (input) => {
  const {
    flex, flexDirection, flexGrow, flexShrink, alignSelf,
    height, width, position, left, top, bottom, right,
    margin, marginBottom, marginLeft, marginRight, marginTop,
    ...style
  } = input;

  return {
    layoutStyle: {
      flex, flexDirection, flexGrow, flexShrink, alignSelf,
      height, width, position, left, top, bottom, right,
      margin, marginBottom, marginLeft, marginRight, marginTop,
    },
    style,
  };
};
