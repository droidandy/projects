import React from 'react';
import { DefaultTheme } from 'styled-components';
import { ThemeProvider } from 'styled-components/native';

import { colors, formatterColor } from './colors';

type Props = {
  children: React.ReactNode;
};

const Theme = ({ children }: Props): JSX.Element => (
  <ThemeProvider theme={{ colors, formatterColor }}>{children}</ThemeProvider>
);

export const theme: DefaultTheme = {
  name: 'All Of Us Theme',
  colors,
  formatterColor,
};

export default Theme;
