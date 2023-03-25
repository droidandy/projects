import * as React from 'react';
import { PanResponder } from 'react-native';
import { VCol } from '../../../Layout';

export interface IVTouchableResponderProps {
  moveThreshold?: number;
}

export class VTouchableResponder extends React.PureComponent<IVTouchableResponderProps> {
  public static defaultProps = {
    moveThreshold: 1,
  };

  private _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { moveThreshold } = this.props;
      return Math.abs(gestureState.dx) >= moveThreshold! || Math.abs(gestureState.dy) >= moveThreshold!;
    },
  });

  public render() {
    return <VCol {...this._panResponder.panHandlers}>{this.props.children}</VCol>;
  }
}
