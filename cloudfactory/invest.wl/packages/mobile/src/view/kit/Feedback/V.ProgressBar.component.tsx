import { Formatter } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { TVThemeColorValue, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { TextStyle } from 'react-native';
import { VThemeUtil } from '../../Theme/V.Theme.util';

import { VCol, VRow } from '../Layout/Flex';
import { IFlexProps } from '../Layout/Flex/V.Flex.util';
import { VText } from '../Output/Text';

export interface IVProgressBarProps extends IFlexProps {
  percent: number;
  precision: number;
  text?: boolean;
  bgActive?: TVThemeColorValue;
}

@observer
export class VProgressBar extends React.Component<IVProgressBarProps> {
  public static defaultProps = {
    precision: 0,
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @observable private _widthText = 0;
  @observable private _width = 0;

  constructor(props: IVProgressBarProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get percent() {
    return `${Formatter.number(this.props.percent, { precision: this.props.precision })}%`;
  }

  @computed
  private get textStyle() {
    const font = this.theme.kit.ProgressBar.text.fText;
    if (!font || !this.props.text) return;
    return {
      backgroundColor: this.theme.kit.ProgressBar.text.cBg,
      padding: 1, position: 'absolute',
      top: -(font.fontSize / 2), left: this.percent,
      ...font,
    } as TextStyle;
  }

  public render() {
    const { percent, text, bgActive, ...props } = this.props;
    const theme = this.theme.kit.ProgressBar;

    return (
      <VRow height={theme.sHeight?.md} radius={theme.sRadius?.md} bg={VThemeUtil.colorPick(theme.cBg)} {...props}
        onLayout={this._onLayoutWidth}>
        <VCol height={'100%'} radius={theme.sRadius?.md} width={this._widthLeft}
          bg={bgActive || VThemeUtil.colorPick(theme.line.cBg)} />
        {!!this.textStyle && (
          <VText left={this._offsetText} color={VThemeUtil.colorPick(theme.text.cText)} style={this.textStyle}
            onLayout={this._onLayoutText}>{this.percent}</VText>
        )}
      </VRow>
    );
  }

  @computed
  private get _widthLeft() {
    return this.props.percent === 0 ? 0 : (this._width * this.props.percent / 100) - this._widthText;
  }

  @computed
  private get _offsetText() {
    return this._widthLeft < 0 ? 0 : this._widthLeft;
  }

  @action
  private _onLayoutWidth = (e: any) => {
    this._width = e.nativeEvent.layout.width;
  };

  @action
  private _onLayoutText = (e: any) => {
    if (this._widthText) return;
    this._widthText = e.nativeEvent.layout.width;
  };
}
