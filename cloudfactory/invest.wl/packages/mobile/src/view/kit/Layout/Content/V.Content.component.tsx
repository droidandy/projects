import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { ISKeyboardStore, SKeyboardStoreTid } from '@invest.wl/system';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, KeyboardAvoidingView, LayoutChangeEvent, StyleSheet, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { VThemeUtil } from '../../../Theme/V.Theme.util';

import { IVFlexProps, VCol } from '../Flex';
import { flexView } from '../Flex/V.Flex.util';

interface IContentProps extends IVFlexProps {
  // TODO: forward ref
  innerRef?: any;
  footerTabs?: boolean;
  scrollEnabled?: boolean;
  keyboardVerticalOffset?: number;
  enableResetScrollToCoords?: boolean;
  noScroll?: boolean;
}

@flexView()
@observer
export class VContent extends React.Component<IContentProps> {
  public static Footer = (_: IVFlexProps) => null;
  public static defaultProps = {
    scrollEnabled: true,
    enableResetScrollToCoords: true,
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private keyboard = IoC.get<ISKeyboardStore>(SKeyboardStoreTid);
  private _ref?: JSX.Element;
  @observable private _heightCurrent = 0;

  constructor(props: IContentProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _notIncludedHeight() {
    // KeyboardAvoidingView высчитывает высоту клавиатуры НЕ ОТ ВЫСОТЫ девайса, а от высоты самого компонента
    // поэтому нужно ему докинуть эту разницу в высоте компонента и девайса
    return this.keyboard.didShow ? Dimensions.get('window').height - this._heightCurrent + (this._style.paddingBottom as number || 0) : 0;
  }

  @computed
  private get _style(): ViewStyle {
    const theme = this.theme.kit.Content;
    const { footerTabs, style, noScroll } = this.props;
    const st = StyleSheet.flatten(style);
    return {
      ...st,
      // если в KeyboardAwareScrollView.style передать массив стилей, он не сможет извлечь оттуда paddingBottom и он пропадёт
      flex: noScroll ? 1 : undefined, flexGrow: noScroll ? undefined : 1,
      paddingBottom: footerTabs ? (st.paddingBottom as number || st.padding as number || 0) + ((this.theme.kit.Tabs.Footer.sHeight?.md || 0)) : st.paddingBottom || st.padding,
      backgroundColor: st.backgroundColor ?? VThemeUtil.colorPick(theme.cBg),
    };
  }

  public componentDidMount() {
    this.props.innerRef?.(this._ref);
  }

  public render() {
    const { children } = this.props;

    return (
      <VCol flex>
        {this._contentRender}
        <CompoundUtils.Find peers={children} byPeerType={VContent.Footer}>{e => !!e && (
          <VCol bg={this._style.backgroundColor} {...e.props} />
        )}</CompoundUtils.Find>
      </VCol>
    );
  }

  @computed
  private get _contentRender() {
    const { children, enableResetScrollToCoords, noScroll } = this.props;

    if (noScroll) {
      return (
        <VCol style={this._style} onLayout={this._onLayoutNoScroll}>
          <KeyboardAvoidingView style={SS.keyboardAwareScrollViewStyle} keyboardVerticalOffset={this._notIncludedHeight}
            behavior={'padding'}>
            {children}
          </KeyboardAvoidingView>
        </VCol>
      );
    }

    return (
      <KeyboardAwareScrollView
        style={SS.keyboardAwareScrollViewStyle}
        contentContainerStyle={this._style}
        innerRef={this._setInnerRef}
        bounces={false}
        enableResetScrollToCoords={enableResetScrollToCoords}
        overScrollMode={'never'}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={this.props.scrollEnabled}
        enableOnAndroid
      >
        {children}
      </KeyboardAwareScrollView>
    );
  }

  private _setInnerRef = (ref: JSX.Element) => {
    this._ref = ref;
  };

  @action
  private _onLayoutNoScroll = (e: LayoutChangeEvent) => {
    this._heightCurrent = e.nativeEvent.layout.height;
  };
}

const SS = StyleSheet.create({
  keyboardAwareScrollViewStyle: {
    flex: 1,
  },
});
