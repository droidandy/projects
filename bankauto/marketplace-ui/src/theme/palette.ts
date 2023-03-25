import { PaletteOptions } from '@material-ui/core/styles/createPalette';

const palette: PaletteOptions = {
  background: {
    default: 'rgba(0,0,0,0)',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#222222',
    secondary: '#8C9091',
    disabled: '#8C9091',
    hint: '#8C9091',
  },
  primary: {
    main: '#990031',
    light: '#AA0630',
    dark: '#730025',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#8C9091',
    light: '#E8E8E8',
    dark: '#616161',
    contrastText: '#FFFFFF',
  },
  common: {
    black: '#222222',
    white: '#FFFFFF',
  },
  error: {
    main: '#FF3D00',
  },
  warning: {
    // main: '#F9C614',
    // dark: '#C88C46',
    main: '#C88C46',
    dark: '#965E1D',
  },
  success: {
    main: '#00C092',
  },
  grey: {
    100: '#F8F8F8',
    200: '#E8E8E8',
    300: '#E7E7E7',
    500: '#8C9091',
    800: '#4B4B4D',
  },
};

export { palette };
