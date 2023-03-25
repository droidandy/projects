import * as React from 'react';
import { TouchableHighlight as RNTouchableHighlight, TouchableHighlightProps as RNTouchableHighlightProps } from 'react-native';
import { TouchableHighlight as GHTouchableHighlight } from 'react-native-gesture-handler';
import { flexView } from '../../Layout/Flex/V.Flex.util';
import { IVTouchableProps } from './V.Touchable.types';
import { VTouchableBase } from './V.TouchableBase.component';

export interface IVTouchableHighlightProps<T = undefined> extends IVTouchableProps<T>,
  Pick<RNTouchableHighlightProps, 'activeOpacity' | 'onHideUnderlay' | 'onShowUnderlay' | 'underlayColor'> {
}

@flexView()
export class VTouchableHighlight<T = undefined> extends React.PureComponent<IVTouchableHighlightProps<T>> {
  public render() {
    return <VTouchableBase Component={RNTouchableHighlight} ComponentFast={GHTouchableHighlight} {...this.props} />;
  }
}
