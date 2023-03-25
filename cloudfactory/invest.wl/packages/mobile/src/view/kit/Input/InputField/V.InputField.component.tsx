import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { LayoutAnimation, NativeSyntheticEvent, Platform, StyleSheet, TextInputFocusEventData } from 'react-native';
import { Easing, Extrapolate, timing, Value } from 'react-native-reanimated';
import { themeStyle, VThemeUtil } from '../../../Theme/V.Theme.util';

import { VAnimationConfig } from '../../Animation/V.Animation.config';
import { IVFlexProps, VCol, VRow } from '../../Layout/Flex';
import { IFlexProps } from '../../Layout/Flex/V.Flex.util';
import { VIcon } from '../../Output/Icon';
import { IVIconProps } from '../../Output/Icon/V.Icon.types';
import { IVTextProps, VText } from '../../Output/Text';
import { VTooltip } from '../../Output/Tooltip';
import { VSlider } from '../Slider';
import { VTouchable } from '../Touchable';
import { PeersConditional } from './PeersConditional.component';
import { VInputButtonHintRight } from './V.InputButtonHintRight.component';
import { VInputRightButton } from './V.InputRightButton.component';
import { IVInputTextProps, VInputText } from './V.InputText.component';
import { IVInputTextMaskProps, VInputTextMask } from './V.InputTextMask.component';
import { IVButtonProps } from '../Button';

export interface IVInputFieldProps extends IFlexProps {
  label?: string;
  disabled?: boolean;
  error?: string | string[] | boolean;
  layoutAnimation?: boolean;
  type?: 'text' | 'password' | 'code';
  isActive?: boolean;
}

const inputFieldAnimation = VAnimationConfig.layoutAnimation.inputField;
const topRowHeight = 18;

@observer
export class VInputField extends React.Component<IVInputFieldProps> {
  public static defaultProps: Partial<IVInputFieldProps> = { layoutAnimation: true };
  public static Input = VInputText;
  public static Field = (_: IVFlexProps) => null;
  public static Slider = VSlider;
  public static RightButton = VInputRightButton;
  public static BottomLeft = (_: IVFlexProps | IVTextProps | IVButtonProps | IVIconProps) => null;
  public static Label = (_: IVTextProps) => null;
  public static HintLeft = (_: IVTextProps) => null;
  public static HintRight = (_: IVTextProps) => null;
  public static HintRightTop = (_: IVTextProps) => null;
  public static Error = (_: IVTextProps) => null;
  public static Mask = (_: IVInputTextMaskProps) => null;
  public static Search = (_: IVIconProps) => null;
  public static RightIcon = (_: IVIconProps) => null;
  public static Float = (_: IVTextProps & { hint?: string }) => null;
  public static Clear = (_: Partial<IVIconProps>) => null;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @observable private _isFocus = false;

  @computed
  private get _inputValue() {
    return this._inputProps.value;
  }

  @observable private _guarded = this.props.type === 'password';
  private _activeAnimatedValue = new Value<number>(0);

  constructor(props: IVInputFieldProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.InputField;
    const {
      children, label, error, layoutAnimation, topRadius, disabled, borderColor, bg, type, ...props
    } = this.props;
    const state = this._state;
    const guarded = this._guarded;
    const hl = state.hintLeft;
    const hr = state.hintRight;
    const hrt = state.hintRightTop;
    const ih = state.inputContainer.height;
    const isMultiline = this._inputProps.multiline;
    let animationProps = {};
    let inputBorderStyle: IVFlexProps = { radius: theme.sRadius?.md };

    if (!!topRadius) inputBorderStyle = { topRadius };
    if (!!borderColor) inputBorderStyle = { ...inputBorderStyle, borderColor, bg };
    if (!!bg) inputBorderStyle = { ...inputBorderStyle, bg };
    if (layoutAnimation) {
      const offsetX = this._activeAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 0],
        extrapolate: Extrapolate.CLAMP,
      });

      const offsetY = this._activeAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [(ih / 2) + (20 / 2), 0],
        extrapolate: Extrapolate.CLAMP,
      });

      animationProps = {
        translateX: offsetX,
        translateY: offsetY,
        animated: true,
      };
    }

    const InputTextInner = this._inputText;

    return (
      <VCol {...props} key={disabled?.toString()}>
        {/* OVER INPUT */}
        <VRow justifyContent={'space-between'} zIndex={1}>
          <CompoundUtils.Find peers={children} byPeerType={VInputField.Label}>{e => (!!e || !!label) ? (
            <VRow flexGrow={3} flexShrink={1} minHeight={topRowHeight} pointerEvents={'none'}
              alignSelf={'flex-start'} {...animationProps}>
              <VText color={state.label.color} style={state.label.font} ellipsizeMode={'tail'}
                numberOfLines={1} {...e?.props}>
                {e?.props.text ?? label}
              </VText>
            </VRow>
          ) : null}</CompoundUtils.Find>
          <CompoundUtils.Find peers={children} byPeerType={VInputField.HintRightTop}>{e => !!e && (
            <VRow flexGrow={1} flexShrink={3} minHeight={topRowHeight} justifyContent={'flex-end'}>
              <VText style={theme.hint.fText} color={hrt.color} numberOfLines={2} {...e?.props} />
            </VRow>
          )}</CompoundUtils.Find>
        </VRow>

        {/* INPUT */}
        <CompoundUtils.Find peers={children} byPeerType={VInputField.Field}>
          {fieldE => (
            <VRow
              alignItems={'center'} borderWidth={theme.sBorder?.md}
              borderColor={!error ? theme.cBorder : theme.error.cMain}
              minHeight={state.inputContainer.height} ph={theme.sPadding?.md} pv={isMultiline ? 8 : 0}
              width {...inputBorderStyle} {...fieldE?.props}
              bg={disabled ? theme.cDisabled : (error ? theme.error.cBg : fieldE?.props.bg || theme.input.cBg)}
            >
              <CompoundUtils.Find peers={children} byPeerType={VInputField.Search}>{e => !!e && !this._inputValue && (
                <VIcon pr={this.theme.space.md} fontSize={theme.backspace.sFont?.md}
                  color={theme.backspace.cMain} {...e.props} />
              )}</CompoundUtils.Find>
              <CompoundUtils.Find peers={children} byPeerType={VInputField.Mask}>{mask => {
                if (mask) {
                  const { onBlur, onFocus, ...inputProps } = this._inputProps!;

                  return (
                    <VInputTextMask style={[styles.mask, theme.input.fText]} color={state.input.color}
                      onBlur={this._onBlur} onFocus={this._onFocus} {...inputProps} {...mask.props} />
                  );
                } else {
                  const input = (
                    <InputTextInner onBlur={this._onBlur} onFocus={this._onFocus} color={state.input.color}
                      onChangeText={this._inputProps.onChangeText} guarded={guarded} />
                  );
                  // add ability click through input field on ios when field disabled
                  return this._inputProps.editable === false
                    ? <VCol flex height={'100%'} pointerEvents={'none'} bg={'transparent'}>{input}</VCol>
                    : input;
                }
              }}</CompoundUtils.Find>
              {/* дробная часть */}
              <CompoundUtils.Find peers={children} byPeerType={VInputField.Float}>{e => !!e && (
                <VRow bg={VThemeUtil.colorPick(theme.float.cBg)} alignItems={'center'} height={'100%'}
                  borderLeftWidth={theme.sBorder?.md}
                  borderColor={VThemeUtil.colorPick(theme.float.cBorder)}>
                  <VText style={theme.float.fText} color={hr.color} ml={theme.float.sMargin?.md} {...e?.props} />
                  {!!e.props.hint && (
                    <VTooltip ml={theme.float.sMargin?.md} text={e.props.hint}
                      alignSelf={'center'}><VTooltip.HintIcon /></VTooltip>
                  )}
                </VRow>
              )}</CompoundUtils.Find>
              {type === 'password' && (
                <VTouchable.Opacity alignSelf={'center'} onPress={this._togglePassword}
                  hitSlop={themeStyle.hitSlop16}>
                  <VIcon name={'eye'} color={VThemeUtil.colorPick(theme.backspace.cMain)}
                    fontSize={theme.backspace.sFont?.md} />
                </VTouchable.Opacity>
              )}
              <CompoundUtils.Find peers={children} byPeerType={VInputField.Clear}>{e => !!e && !!this._inputValue && (
                <VTouchable.Opacity onPress={this._delete} hitSlop={themeStyle.hitSlop16}>
                  <VIcon name={'close'} fontSize={theme.backspace.sFont?.md}
                    color={theme.backspace.cMain} {...e.props} />
                </VTouchable.Opacity>
              )}</CompoundUtils.Find>
              {/* правая кнопка-иконка */}
              <CompoundUtils.Find peers={children} byCondition={VInputRightButton.buttonTypeCondition}>{e => !!e && (
                React.cloneElement(e, { color: e.props.color ?? theme.backspace.cMain })
              )}</CompoundUtils.Find>
              {/* /!* правая иконка *!/ */}
              <CompoundUtils.Find peers={children} byPeerType={VInputField.RightIcon}>{e => !!e && (
                <VIcon fontSize={theme.backspace.sFont?.md} {...e.props} />
              )}</CompoundUtils.Find>
            </VRow>
          )}
        </CompoundUtils.Find>

        {/* UNDER INPUT */}
        <CompoundUtils.Find peers={children} byPeerType={VInputField.Slider}>{e => !!e && (
          <>
            <VInputField.Slider style={styles.slider}
              absolute zIndex={1} bottom={0} height={theme.slider.sHeight?.md} {...e.props} />
            <VCol height={theme.slider.sHeight?.md! / 2} />
          </>
        )}</CompoundUtils.Find>
        <CompoundUtils.Find peers={children} byPeerType={VInputField.BottomLeft}>{e => !!e && (
          e?.props.children
        )}</CompoundUtils.Find>
        <PeersConditional peers={children} predicate={this._hintRowPredicate}>
          <VRow minHeight={theme.error.sHeight?.md} mt={theme.error.sMargin?.md} justifyContent={'space-between'}>
            <VCol flex>
              {/* невидимый текст для отбивки места под левый хинт и ошибку */}
              <CompoundUtils.Find peers={children} byPeerType={VInputField.HintLeft}>{e => (
                <VText opacity={0} style={theme.hint.fText} color={hl.color} text={state.hintPlaceholder.text}
                  pr={theme.hint.sPadding?.md} {...e?.props} />
              )}</CompoundUtils.Find>
              {/* текст левого хинта */}
              <CompoundUtils.Find peers={children} byPeerType={VInputField.HintLeft}>{e => (
                <VText absolute opacity={hl.opacity} style={theme.hint.fText} color={hl.color}
                  pr={theme.hint.sPadding?.md} {...e?.props} />
              )}</CompoundUtils.Find>
              {/* текст ошибки */}
              <CompoundUtils.Find peers={children} byPeerType={VInputField.Error}>{e => (
                <VText absolute style={theme.error.fText} color={hl.color} text={state.errorText}
                  pr={theme.error.sPadding?.md} {...e?.props} />
              )}</CompoundUtils.Find>
            </VCol>
            {/* текст правого хинта */}
            <CompoundUtils.Find peers={children} byPeerType={VInputField.HintRight}>{e => (
              <VText style={theme.hint.fText} color={hr.color} ml={theme.hint.sPadding?.md} {...e?.props} />
            )}</CompoundUtils.Find>
            {/* правая кнопка - которая правильно работает в HintLeft блоке */}
            <CompoundUtils.Find peers={children} byCondition={VInputButtonHintRight.buttonTypeCondition}>{e => !!e && (
              React.cloneElement(e, { color: e.props.color ?? theme.backspace.cMain })
            )}</CompoundUtils.Find>
          </VRow>
        </PeersConditional>
      </VCol>
    );
  }

  private _inputText = observer((props: IVInputTextProps) => {
    const theme = this.theme.kit.InputField;
    const inputProps = this._inputProps;
    const { error } = this.props;
    const color = error ? theme.error.cText : theme.input.cText;

    return (
      <VInputText
        height={'100%'} color={VThemeUtil.colorPick(color)} style={theme.input.fText} flex
        placeholderTextColor={VThemeUtil.colorPick(theme.placeholder.cText)}
        {...{ ...inputProps, ...props }}
      />
    );
  });

  @computed
  private get _inputProps(): IVInputTextProps {
    const inputProps = { ...ReactUtils.findElementByType(this.props.children, VInputField.Input)?.props };
    if (this.props.disabled) inputProps.editable = false;
    return inputProps;
  }

  @computed
  private get _state() {
    const theme = this.theme.kit.InputField;
    const props = this.props;
    const isError = !!props.error;
    const errorText = isString(props.error) ? props.error : (isArray(props.error) ? props.error.join(' ') : undefined);
    const inputColor = VThemeUtil.colorPick(isError ? theme.error.cText : theme.input.cText);
    const labelColor = VThemeUtil.colorPick(isError ? theme.error.cText : this._isFocus ? theme.label.cText : undefined);
    const hintColor = VThemeUtil.colorPick(isError ? theme.error.cText : theme.hint.cText);
    return {
      isError, errorText,
      input: { color: inputColor },
      inputContainer: { height: theme.sHeight?.md ?? 48 },
      label: {
        color: this._isActive ? labelColor || theme.label.cText : labelColor || theme.placeholder.cText,
        font: this._isActive ? theme.label.fText : theme.placeholder.fText,
      },
      hintLeft: {
        color: hintColor,
        opacity: !errorText ? 1 : 0,
      },
      hintRight: { color: hintColor },
      hintRightTop: { color: hintColor },
      hintPlaceholder: { text: errorText },
    };
  }

  @action
  private _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this._isFocus = true;
    if (this.props.layoutAnimation) {
      LayoutAnimation.configureNext(inputFieldAnimation);
      this._startAnimation(this._isActive);
    }
    this._inputProps.onFocus?.(e);
  };

  @action
  private _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this._isFocus = false;
    if (this.props.layoutAnimation) {
      LayoutAnimation.configureNext(inputFieldAnimation);
      this._startAnimation(this._isActive);
    }
    this._inputProps.onBlur?.(e);
  };

  @computed
  private get _isActive() {
    // если значение было установлено программно нужно поднять лэйбл
    if (!!this._inputValue && !this._isFocus) this._startAnimation(true);
    return this._isFocus || !!this._inputValue || (!!this.props.isActive && !this._isFocus);
  }

  @action
  private _togglePassword = () => {
    this._guarded = !this._guarded;
  };

  @action
  private _delete = () => {
    this._inputProps.onChangeText?.('');
  };

  private _hintRowPredicate = (e?: React.ReactElement) => {
    const errorUsed = 'error' in this.props;
    const errorText = this._state.errorText;
    return e?.type === VInputField.HintLeft || e?.type === VInputField.HintRight || errorUsed || !!errorText;
  };

  private _startAnimation(isActive: boolean, animated = true) {
    const toValue = isActive ? 1 : 0;
    if (animated) {
      requestAnimationFrame(() => {
        timing(this._activeAnimatedValue, {
          toValue,
          duration: VAnimationConfig.inputFieldDuration,
          easing: Easing.linear,
        }).start();
      });
    } else {
      this._activeAnimatedValue.setValue(toValue);
    }
  }
}

const styles = StyleSheet.create({
  slider: {
    ...Platform.select({
      ios: {
        left: -3,
        right: -3,
      },
      android: {
        left: -16,
        right: -16,
      },
    }),
  },
  mask: { flex: 1, height: '100%' },
});
