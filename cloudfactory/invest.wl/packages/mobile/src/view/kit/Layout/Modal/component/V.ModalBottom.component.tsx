import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IVModalModel } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, ScrollView, ScrollViewProps, StyleProp, StyleSheet } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { IVFlexProps, VCol } from '../../Flex';
import { IFlexProps } from '../../Flex/V.Flex.util';

import { IVModalInternalProps } from '../V.Modal.types';
import { IVModalProps, VModal } from './V.Modal.component';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

interface IVModalBottomProps<C> extends IVModalInternalProps<C> {
  readonly model?: IVModalModel<C, IVModalProps>;
  readonly isSwipeClose?: boolean;
  readonly isEditableContent?: boolean;
  readonly isFullScreen?: boolean;
}

@observer
export class VModalBottom<T = undefined> extends React.Component<IVModalBottomProps<T>> {
  public static Header = (_: IVFlexProps) => null;
  public static Body = (_: ScrollViewProps & { children?: React.ReactNode }) => null;
  public static Footer = (_: IVFlexProps) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @observable public scrollOffset = 0;
  @observable public scrollViewHeight = 0;
  @observable public contentHeight = 0;
  private _scrollViewRef = React.createRef<ScrollView>();

  constructor(props: IVModalBottomProps<T>) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { style, children, isSwipeClose, ...props } = this.props;

    return (
      <VModal style={SS.modal}
        swipeDirection={isSwipeClose ? 'down' : undefined}
        scrollTo={this._onScrollTo}
        // TODO: Если нужно закрыть свайпом Modal внутри которого Date,
        // то можно в scrollOffset передать значение больше 0.
        // У Date есть onDateChange, но он вызывается не в момент прокрутки...
        // Видимо нужно обернуть Date в какой нибудь View и как-то обрабатывать...
        scrollOffset={this.scrollOffset}
        scrollOffsetMax={this.contentHeight - this.scrollViewHeight}
        propagateSwipe
        useNativeDriver={false}
        {...props}
      >
        {this._contentRender}
      </VModal>
    );
  }

  @computed
  private get _contentRender() {
    const { children, isSwipeClose, isEditableContent, isFullScreen } = this.props;
    // for editable modal we set flexible ui to fill content on keyboard shown
    const contentStyle: StyleProp<IFlexProps> = isEditableContent
      ? { flex: isFullScreen ? 1 : 0.7 }
      : { maxHeight: SCREEN_HEIGHT * 0.75 };
    const theme = this.theme.kit.ModalBottom;

    return (
      <SafeAreaInsetsContext.Consumer>{(insets) => (
        <VCol leftTopRadius={theme.sRadius?.md} rightTopRadius={theme.sRadius?.md}
          bg={VThemeUtil.colorPick(theme.cBg)} pb={insets?.bottom} {...contentStyle}>
          {isSwipeClose && (
            <VCol absolute width pa={theme.close.sPadding?.md} justifyContent={'center'} alignItems={'center'} zIndex={1}>
              <VCol width={theme.close.sWidth?.md} height={theme.close.sHeight?.md} radius={theme.close.sRadius?.md}
                bg={VThemeUtil.colorPick(theme.close.cBg)} />
            </VCol>
          )}
          <CompoundUtils.Find peers={children} byPeerType={VModalBottom.Header}>{e => !!e && (
            <VCol {...e.props} />
          )}</CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VModalBottom.Body}>{e => !!e && (
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              ref={this._scrollViewRef}
              onScroll={this._onScroll}
              onLayout={this._onLayout}
              onContentSizeChange={this._onContentSizeChange}
              scrollEventThrottle={16}
              {...e.props}
            />
          )}</CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VModalBottom.Footer}>{e => !!e && (
            <VCol {...e.props} />
          )}</CompoundUtils.Find>
        </VCol>
      )}</SafeAreaInsetsContext.Consumer>
    );
  }

  private _onScrollTo = (e: any) => this._scrollViewRef.current?.scrollTo(e);

  @action private _onScroll = (e: any) => this.scrollOffset = e.nativeEvent.contentOffset.y;
  @action private _onLayout = (e: any) => this.scrollViewHeight = e.nativeEvent.layout.height;
  @action private _onContentSizeChange = (_: number, h: number) => this.contentHeight = h;
}

const SS = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  customBackdrop: {
    flex: 1,
  },
});
