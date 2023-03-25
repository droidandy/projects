import { IoC } from '@invest.wl/core';
import { observer } from 'mobx-react';
import * as React from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { PropsExtractorType } from '../../../types/react.types';
import { IVFlexProps, VCol } from '../../Layout/Flex';
import { VSwipeableRowStore, VSwipeableRowStoreTid } from './V.SwipeableRow.store';

export interface IVSwipeableRowProps {
  leftContent?: JSX.Element;
  rightContent?: JSX.Element;
  // если значение меняется, надо закрыться
  needClose?: any;
  onLeftSwipe?(): void;
  onRightSwipe?(): void;
  onDrag?(): void;
  onClose?(): void;
}

export const extractSwipeableRowProps: PropsExtractorType<IVSwipeableRowProps> = props => {
  const {
    leftContent, rightContent, needClose, onLeftSwipe, onRightSwipe, onClose, onDrag, ...rest
  } = props;
  return {
    props: {
      leftContent, rightContent, needClose, onLeftSwipe, onRightSwipe, onClose, onDrag,
    },
    rest,
  };
};

export interface IVSwipeableRowViewProps extends IVSwipeableRowProps, IVFlexProps {
}

@observer
export class VSwipeableRow extends React.Component<IVSwipeableRowViewProps, Record<string, any>> {
  private _store = IoC.get<VSwipeableRowStore>(VSwipeableRowStoreTid);

  private _ref = React.createRef<Swipeable>();

  public componentDidUpdate(prevProps: IVSwipeableRowViewProps, state: any) {
    if (prevProps.needClose !== this.props.needClose) this.close();
  }

  public componentWillUnmount() {
    this._store.clear();
  }

  public render() {
    const { props, rest } = extractSwipeableRowProps(this.props);
    const dragEnabled = !!props.leftContent || !!props.rightContent;

    return (
      <VCol {...rest}>
        <Swipeable
          ref={this._ref}
          enabled={dragEnabled}
          friction={2}
          enableTrackpadTwoFingerGesture
          renderLeftActions={this._renderLeft}
          renderRightActions={this._renderRight}
          onSwipeableOpen={this._onSwipeableOpen}
          onSwipeableClose={this.onSwipeableClose}
          onSwipeableRightOpen={props.onRightSwipe}
          onSwipeableLeftOpen={props.onLeftSwipe}
        >
          {this.props.children}
        </Swipeable>
      </VCol>
    );
  }

  public close = () => this._ref.current?.close();

  private _renderRight = () => this.props.rightContent;
  private _renderLeft = () => this.props.leftContent;

  private _onSwipeableOpen = () => {
    this._store.onOpen(this.close);
  };

  private onSwipeableClose = () => {
    this.props.onClose?.();
    this._store.onClose();
  };

  public openRight = () => {
    this._ref.current?.openRight();
  };
}
