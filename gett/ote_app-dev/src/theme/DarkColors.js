import Color from './Color';

export const color = {
  primaryText: '#ffffff',
  secondaryText: 'rgba(255,255,255,0.6)',
  arrowRight: '#bbbbbf',
  pixelLine: 'rgba(255,255,255,0.2)',
  bgPrimary: '#252525',
  bgSecondary: '#373737',
  white: '#ffffff',
  black: '#000000',
  primaryBtns: '#fdb924',
  secondaryBtns: '#373737',
  link: '#1d94f7',
  disabledLink: 'rgba(255,255,255,0.6)',
  success: '#00c46b',
  info: '#ffffff',
  danger: '#ff3636',
  successLight: 'rgba(0,196,107,0.2)',
  infoLight: 'rgba(255,255,255,0.13)',
  dangerLight: 'rgba(255,54,54,0.2)',
  backdrop: 'rgba(55,55,55,0.6)',
  newNotifications: '#474747',
  route: '#696969',
  flightContainer: '#2c2c2c',
  flightHeader: '#252525'
};

export const formattedColor = {};
Object.keys(color).forEach((key) => {
  formattedColor[key] = new Color(color[key]);
});

export default {
  color,
  formattedColor
};
