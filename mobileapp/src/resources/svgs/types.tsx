import { StyleProp, ViewStyle } from 'react-native';

export interface SvgIconProps {
  active?: boolean;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export type SVGIconComponent = ({ active, height, width }: SvgIconProps) => JSX.Element;
