import * as React from 'react';
import { TouchableWithoutFeedback as RNTouchableWithoutFeedback } from 'react-native';
import { TouchableWithoutFeedback as GHTouchableWithoutFeedback } from 'react-native-gesture-handler';
import { flexView } from '../../Layout/Flex/V.Flex.util';
import { IVTouchableFastProps, IVTouchableProps } from './V.Touchable.types';
import { VTouchableBase } from './V.TouchableBase.component';

export interface IVTouchableWithoutFeedbackProps<T = any> extends IVTouchableProps<T>, IVTouchableFastProps {
}

@flexView()
export class VTouchableWithoutFeedback<T = any> extends React.PureComponent<IVTouchableWithoutFeedbackProps<T>> {
  public render() {
    return (
      <VTouchableBase Component={RNTouchableWithoutFeedback}
        ComponentFast={GHTouchableWithoutFeedback} {...this.props} />
    );
  }
}
