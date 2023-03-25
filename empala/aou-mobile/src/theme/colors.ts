import Color from 'color';

export const colors = {
  White: '#ffffff',
  Black: '#0F172A',
  Green200: '#00C0A9',
  Grey200: '#F4F7FB',
  Grey300: '#F8FAFC',
  Grey400: '#8B9195',
  Grey600: '#C1CACF',
  Grey800: '#444749',
  Geyser: '#CBD5E1',
  GreyDarkest: '#475569',
  GreyGull: '#94A3B8',
  GreyLoader: '#C0C0C0',
  Dark: '#002D61',
  BrandBlue200: '#005BC7',
  Greenish: '#245CC0',
  BrandBlue600: '#004596',
  Darkblue: '#0E2D5D',
  Red: '#EA2B27',
  ModalBackground: '#002D61',
  UIErrorDark: '#F43F5E',
};

export const formatterColor = {
  Dark50: Color(colors.Dark).alpha(0.05).toString(),
  Dark200: Color(colors.Dark).alpha(0.2).toString(),
  Dark400: Color(colors.Dark).alpha(0.4).toString(),
  Dark660: Color(colors.Dark).alpha(0.66).toString(),
  Dark800: Color(colors.Dark).alpha(0.8).toString(),
  Bubble: Color('#203854').alpha(0.12).toString(),
  Darkblue: Color(colors.Darkblue).alpha(0.2).toString(),
  Light200: Color(colors.White).alpha(0.2).toString(),
  Light400: Color(colors.White).alpha(0.4).toString(),
  Light600: Color(colors.White).alpha(0.6).toString(),
  Light800: Color(colors.White).alpha(0.8).toString(),
  Light900: Color(colors.White).alpha(0.9).toString(),
  ModalBackground: Color(colors.ModalBackground).alpha(1).toString(),
};

const tintColorLight = '#004596';
const tintColorDark = colors.White;

export const colorTheme = {
  light: {
    text: '#000',
    background: colors.White,
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
