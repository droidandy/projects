import React from 'react';
import { BreakpointOverrides } from '@material-ui/core/styles/createBreakpoints';

declare module '@material-ui/core/styles/createBreakpoints' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    appDrawer: {
      width: React.CSSProperties['width'];
      breakpoint: BreakpointOverrides;
    };
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    appDrawer?: {
      width?: React.CSSProperties['width'];
      breakpoint?: BreakpointOverrides;
    };
  }
}

const breakpoints = {
  values: {
    xs: 0,
    sm: 769,
    md: 961,
    lg: 1441,
    xl: 1921,
  },
};

export { breakpoints };
