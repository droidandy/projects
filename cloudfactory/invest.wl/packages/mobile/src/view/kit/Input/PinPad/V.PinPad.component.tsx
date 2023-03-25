import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import isEqual from 'lodash/isEqual';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { FlexAlignType, StyleSheet } from 'react-native';
import { DimensionsHeight, DimensionsWidth, VThemeUtil } from '../../../Theme/V.Theme.util';
import { JustifyContentType } from '../../../types/react.types';

import { IVFlexProps, VCol, VRow } from '../../Layout';
import { VIcon, VText } from '../../Output';
import { VTouchable } from '../Touchable';

export enum EVPinPadState {
  OK = 0,
  SAMPLE_ENTERED,
  ERROR,
}

export interface IVPinPadResult {
  state: EVPinPadState;
  code: string;
}

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface IVPinPadProps extends IVFlexProps {
  length: number;
  confirmation?: boolean;
  title?: string;
  titleConfirm?: string;
  disabled?: boolean;
  buttonLeft?: React.ReactNode;
  buttonBackspace?: React.ReactNode;
  buttonNumber?(num: number): React.ReactNode;
  onFulfilled(res: IVPinPadResult): void;
  onChanged?(code: string): void;
}

@observer
export class VPinPad extends React.Component<IVPinPadProps> {
  public static defaultProps: Partial<IVPinPadProps> = {
    title: 'Придумайте короткий код',
    titleConfirm: 'Повторите код',
  };

  private _width = DimensionsWidth > DimensionsHeight ? DimensionsHeight : DimensionsWidth;
  private _buttonDiameter = this._width / 5;
  private _buttonMargin = this._buttonDiameter / 3;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  @observable private _lastCharVisibility = true;

  constructor(props: IVPinPadProps) {
    super(props);
    makeObservable(this);
  }


  @observable public code: number[] = [];
  @observable public codeConfirm: number[] = [];

  @computed
  public get isConfirmShow() {
    return this.props.confirmation && this.code.length >= this.props.length && !this._lastCharVisibility;
  }

  public render() {
    const theme = this.theme.kit.PinPad;
    const { title, titleConfirm, confirmation, disabled, onChanged, ...flexProps } = this.props;
    return (
      <VCol {...flexProps}>
        {title && (
          <VText style={theme.title.fText} color={VThemeUtil.colorPick(theme.title.cText)}
            ta={'center'} mb={theme.title.sMargin?.md}>{this.isConfirmShow ? titleConfirm || title : title}</VText>
        )}
        {this._renderDots}
        <VRow style={this._style.buttonList} alignSelf={'center'} alignItems={'flex-start'}
          alignContent={'space-between'} justifyContent={'space-between'}>
          {NUMBERS.map((num) => this._renderNumber(num))}
          {this._leftButtonRender}
          {this._renderNumber(0)}
          {this._backspaceRender}
        </VRow>
      </VCol>
    );
  }

  @action.bound
  public clear(onlyConfirm?: boolean) {
    this._lastCharVisibility = true;
    this.codeConfirm = [];
    if (!onlyConfirm) this.code = [];
  }

  @computed
  private get _renderDots() {
    const theme = this.theme.kit.PinPad;
    const { disabled, length } = this.props;
    const code: number[] = this.isConfirmShow ? this.codeConfirm : this.code;
    const dots = [];

    for (let i = 0; i < length; ++i) {
      const filled = i < code.length;
      dots.push((
        <VCol key={i} bg={VThemeUtil.colorPick(filled ? theme.dot.cActive : theme.dot.cInactive)}
          style={[this._style.dot, disabled && this._style.dotDisabled]} />
      ));
    }

    return (<VRow justifyContent={'center'} mb={theme.dot.sMargin?.md}>{dots}</VRow>);
  }

  private _renderNumber(num: number) {
    const theme = this.theme.kit.PinPad.number;
    const { buttonNumber } = this.props;
    return (
      <VTouchable.Opacity fast context={num} key={num} onPress={this._onNumber} disabled={this.props.disabled}>
        <VCol bg={VThemeUtil.colorPick(theme.cBg)} {...this._buttonStyle}>
          {buttonNumber ? buttonNumber(num) : (
            <VText style={theme.fText} color={VThemeUtil.colorPick(theme.cText)}>{num}</VText>
          )}
        </VCol>
      </VTouchable.Opacity>
    );
  }

  @computed
  private get _backspaceRender() {
    const theme = this.theme.kit.PinPad.icon;
    const { buttonBackspace } = this.props;
    const needRender = this.code.length > 0;

    return (
      <VTouchable.Opacity onPress={this._onBackspace}>
        <VCol bg={needRender ? VThemeUtil.colorPick(theme.cBg) : undefined}
          overflow={'hidden'} {...this._buttonStyle}>
          {needRender && (buttonBackspace || (
            <VIcon name={'backspace'} color={VThemeUtil.colorPick(theme.cMain)}
              fontSize={theme.sFont?.md} />
          )
          )}
        </VCol>
      </VTouchable.Opacity>
    );
  }

  @computed
  private get _leftButtonRender() {
    const theme = this.theme.kit.PinPad.icon;
    return (
      <VCol bg={!!this.props.buttonLeft ? VThemeUtil.colorPick(theme.cBg) : undefined}
        {...this._buttonStyle}>
        {this.props.buttonLeft}
      </VCol>
    );
  }

  @computed
  private get _buttonStyle() {
    const theme = this.theme.kit.PinPad.button;

    return {
      alignItems: 'center' as FlexAlignType,
      justifyContent: 'center' as JustifyContentType,
      marginVertical: (theme.sMargin?.md || this._buttonMargin) / 2,
      width: theme.sWidth?.md || this._buttonDiameter,
      height: theme.sWidth?.md || this._buttonDiameter,
      radius: theme.sRadius?.md,
    };
  }

  private _onBackspace = () => {
    if (this.codeConfirm.length) this._removeLastNumber('codeConfirm');
    else if (this.code.length) this._removeLastNumber('code');
  };

  @action
  private _removeLastNumber(key: 'code' | 'codeConfirm') {
    if (key === 'code') this._lastCharVisibility = true;
    this[key] = this[key].slice(0, this[key].length - 1);
    this.props.onChanged?.(this[key].join(''));
  }

  private _onNumber = (num: number) => {
    if (this.props.confirmation && this.code.length >= this.props.length) {
      this._addNumber('codeConfirm', num);
    } else {
      this._addNumber('code', num);
    }
  };

  @action
  private _addNumber(key: 'code' | 'codeConfirm', num: number) {
    const { onChanged, onFulfilled, length, confirmation } = this.props;
    if (this[key].length >= length) return;
    if (key === 'codeConfirm') this._lastCharVisibility = false;

    this[key] = this[key].concat(num);
    const code = this[key].join('');
    onChanged?.(code);
    if (code.length === length) {
      onFulfilled({
        code,
        state: key === 'code'
          ? (confirmation ? EVPinPadState.SAMPLE_ENTERED : EVPinPadState.OK)
          : (!isEqual(this.code, this.codeConfirm) ? EVPinPadState.ERROR : EVPinPadState.OK),
      });
      if (confirmation && key === 'code') {
        setTimeout(() => {
          runInAction(() => this._lastCharVisibility = false);
        }, 1000);
      }
    }
  }

  @computed
  private get _style() {
    const theme = this.theme.kit.PinPad;
    const dotDiameter = theme.dot.sWidth?.md || 6;

    return StyleSheet.create({
      dot: {
        marginHorizontal: theme.dot.sMargin?.md,
        width: dotDiameter,
        height: dotDiameter,
        borderRadius: dotDiameter / 2,
        borderWidth: theme.dot.sBorder?.md,
        borderColor: VThemeUtil.colorPick(theme.dot.cBorder),
      },
      dotDisabled: { borderColor: 'gray', backgroundColor: 'transparent' },
      buttonList: {
        flexWrap: 'wrap',
        width: (this._buttonStyle.width * 3) + (this._buttonStyle.marginVertical * 4),
      },
    });
  }
}
