import { TVIconName } from '@invest.wl/view';
import { ColorValue, Insets, TextProps } from 'react-native';
import { IFlexProps } from '../../Layout/Flex/V.Flex.util';

export interface IVIconProps {
  name: TVIconName;
  color?: ColorValue;
  hitSlop?: Insets;
  fontSize?: number;
}

export interface IVIconViewProps extends IVIconProps, TextProps, IFlexProps {
  onPress?(): void;
}
