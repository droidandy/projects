import Color from './Color';

export const color = {
  primaryText: '#373737',
  secondaryText: '#a0a0a0',
  arrowRight: '#bbbbbf',
  pixelLine: '#d8d8d8',
  bgPrimary: '#ffffff',
  bgSecondary: '#ebebeb',
  white: '#ffffff',
  black: '#000000',
  primaryBtns: '#fdb924',
  secondaryBtns: '#ffffff',
  link: '#1d94f7',
  disabledLink: 'rgba(55,55,55,0.6)',
  success: '#00c46b',
  info: '#373737',
  danger: '#ff3636',
  successLight: 'rgba(0,196,107,0.2)',
  infoLight: '#ebebeb',
  dangerLight: 'rgba(255,54,54,0.2)',
  backdrop: 'rgba(55,55,55,0.6)',
  newNotifications: '#fff7e5',
  route: '#373737',
  flightContainer: '#ebebeb',
  flightHeader: '#373737'
};

export const formattedColor = {};
Object.keys(color).forEach((key) => {
  formattedColor[key] = new Color(color[key]);
});

export default {
  color,
  formattedColor
};
