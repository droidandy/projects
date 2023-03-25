declare module 'react-native-vector-icons' {
  import * as React from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  interface Props<GM extends { [key: string]: number }> {
    name: keyof GM;
    size?: number;
    color?: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  }

  interface IconStatic<GM extends { [key: string]: number }> extends React.ClassicComponentClass<Props<GM>> {

  }

  export function createIconSet<GM extends { [key: string]: number }>(
    glyphMap: { [key: string]: number },
    fontFamily: string,
    fontFile?: string
  ): IconStatic<GM>;

  // createIconSetFromFontello
  // createIconSetFromIcoMoon
}
