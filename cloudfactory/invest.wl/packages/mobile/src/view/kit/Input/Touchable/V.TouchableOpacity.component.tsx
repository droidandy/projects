import * as React from 'react';
import { TouchableOpacity as RNTouchableOpacity, TouchableOpacityProps as RNTouchableOpacityProps } from 'react-native';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { flexView } from '../../Layout/Flex/V.Flex.util';
import { VTouchableConfig } from './V.Touchable.config';
import { IVTouchableProps } from './V.Touchable.types';
import { VTouchableBase } from './V.TouchableBase.component';

export interface IVTouchableOpacityProps<T = undefined> extends IVTouchableProps<T>, Pick<RNTouchableOpacityProps, 'activeOpacity'> {
}

@flexView()
export class VTouchableOpacity<T = undefined> extends React.PureComponent<IVTouchableOpacityProps<T>> {
  public static defaultProps: Partial<IVTouchableOpacityProps> = {
    activeOpacity: VTouchableConfig.activeOpacityDefault,
  };

  public render() {
    return <VTouchableBase Component={RNTouchableOpacity} ComponentFast={GHTouchableOpacity} {...this.props} />;
  }
}
