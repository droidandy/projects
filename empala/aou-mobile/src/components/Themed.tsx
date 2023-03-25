/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { Text as DefaultText, View as DefaultView, Button as DefaultButton } from 'react-native';

import useColorScheme from '../hooks/useColorScheme';

import { colorTheme } from '~/theme/colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof colorTheme.light & keyof typeof colorTheme.dark,
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return colorTheme[theme][colorName];
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const {
    style, lightColor, darkColor, ...otherProps
  } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const {
    style, lightColor, darkColor, ...otherProps
  } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps): JSX.Element {
  const {
    style, lightColor, darkColor, ...otherProps
  } = props;
  return <DefaultButton {...otherProps} />;
}
