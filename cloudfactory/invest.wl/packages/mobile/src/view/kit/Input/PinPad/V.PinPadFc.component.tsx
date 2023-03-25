import { TVIconName, useTheme } from '@invest.wl/view';
import { range } from 'lodash';
import * as React from 'react';
import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVFlexProps, VCol, VRow } from '../../Layout';
import { VIcon, VText } from '../../Output';
import { VTouchable } from '../Touchable';

export enum EVPinPadFcState {
  OK = 0,
  SAMPLE_ENTERED,
  NOT_CONFIRMED,
}

export interface IVPinPadFcResult {
  state: EVPinPadFcState;
  code: string;
}

export interface IVPinPadInstance {
  clear(): void;
}

export interface IVPinPadFcProps extends IVFlexProps {
  title?: string;
  titleConfirm?: string;
  length: number;
  disabled?: boolean;
  onFulfilled: (res: IVPinPadFcResult) => void;
  biometryIcon?: TVIconName;
  onBiometryPress?: () => void;
}

export const VPinPadFc = React.forwardRef<IVPinPadInstance, IVPinPadFcProps>((props, ref) => {
  const { title, titleConfirm, length, disabled, biometryIcon, onBiometryPress, onFulfilled, ...flexProps } = props;
  const [store] = useTheme();
  const theme = store.kit.PinPad;

  const [code, setCode] = useState<number[]>([]);
  const [codeConfirmation, setCodeConfirmation] = useState<number[]>([]);

  const confirmationStep = titleConfirm && code.length === length;
  const fulfilled = confirmationStep ? codeConfirmation.length === length : code.length === length;

  const onNumberPressed = useCallback(value => {
    const updateCode = confirmationStep ? setCodeConfirmation : setCode;
    updateCode(oldCode => oldCode.length === length ? oldCode : [...oldCode, value]);
  }, [confirmationStep, length]);

  const onBackspacePressed = useCallback(() => {
    const updateCode = confirmationStep && codeConfirmation.length !== 0 ? setCodeConfirmation : setCode;
    updateCode(oldCode => oldCode.length > 0 ? oldCode.slice(0, -1) : oldCode);
  }, [confirmationStep, codeConfirmation]);

  useEffect(() => {
    if (fulfilled) {
      const stringCode = code.join('');
      const stringCodeConfirmation = codeConfirmation.join('');

      if (confirmationStep) {
        onFulfilled({
          code: stringCode,
          state: stringCode === stringCodeConfirmation ? EVPinPadFcState.OK : EVPinPadFcState.NOT_CONFIRMED,
        });
      } else {
        onFulfilled({ code: stringCode, state: EVPinPadFcState.OK });
      }
    }
  }, [code, codeConfirmation, confirmationStep, fulfilled, onFulfilled]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setCode([]);
      setCodeConfirmation([]);
    },
  }));

  return (
    <VCol mt={theme.header.sMargin?.xl} {...flexProps}>
      <HeaderComponent
        text={confirmationStep ? titleConfirm : title}
        dots={length}
        progress={confirmationStep ? codeConfirmation.length : code.length}
        disabled={!!disabled || fulfilled}
      />

      <PadComponent
        disabled={!!disabled || fulfilled}
        onNumberPressed={onNumberPressed}
        leftIcon={biometryIcon}
        onLeftIconPressed={onBiometryPress}
        onBackspacePressed={confirmationStep || code.length > 0 ? onBackspacePressed : undefined}
      />
    </VCol>
  );
});

const HeaderComponent: React.FC<{ text?: string; dots: number; progress: number; disabled: boolean }> = (props) => {
  const [store] = useTheme();
  const theme = store.kit.PinPad;
  return (
    <VCol justifyContent={'center'} alignItems={'center'}>
      {!!props.text && (
        <VText color={VThemeUtil.colorPick(theme.title.cText)} style={theme.title.fText} ta={'center'}>
          {props.text}
        </VText>
      )}

      <VRow mt={theme.dot.sMargin?.lg}>
        {range(0, props.dots).map(value => (
          <VCol
            key={value}
            width={theme.dot.sWidth?.md}
            height={theme.dot.sWidth?.md}
            radius={theme.dot.sWidth?.md! / 2}
            borderColor={VThemeUtil.colorPick(theme.dot.cBg)}
            bg={props.disabled ? VThemeUtil.colorPick(theme.dot.cDisabled) : (value < props.progress ? VThemeUtil.colorPick(theme.dot.cBg) : undefined)}
            borderWidth={theme.dot.sBorder?.xs}
            mh={theme.dot.sMargin?.md}
          />
        ))}
      </VRow>
    </VCol>
  );
};

const PadComponent: React.FC<{
  disabled: boolean;
  onNumberPressed: (value: number) => void;
  leftIcon?: TVIconName;
  onLeftIconPressed?: () => void;
  onBackspacePressed?: () => void;
}> = (props) => {
  const [store] = useTheme();
  const theme = store.kit.PinPad;
  const { disabled, onNumberPressed, leftIcon, onLeftIconPressed, onBackspacePressed } = props;

  const iconDiameter = theme.number.sWidth?.lg! * 0.67;
  const styles = StyleSheet.create({
    rightButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: iconDiameter,
      height: iconDiameter,
      borderTopLeftRadius: 0,
      borderTopRightRadius: iconDiameter / 2,
      borderBottomRightRadius: iconDiameter / 2,
      borderBottomLeftRadius: iconDiameter / 2,
      transform: [{ rotateZ: '-45deg' }],
    },
    backspace: { transform: [{ rotateZ: '45deg' }] },
  });

  return (
    <VRow mt={theme.number.sMargin?.xl} wrap={'wrap'}
      width={theme.number.sWidth?.lg! * 3 + theme.number.sMargin?.xs! * 6}>
      {range(1, 10).map(digit => (
        <NumberButton
          key={digit}
          value={digit}
          disabled={disabled}
          onPressed={onNumberPressed}
        />
      ))}

      {!!leftIcon && !!onLeftIconPressed ? (
        <IconButton name={leftIcon} disabled={disabled} onPressed={onLeftIconPressed} />
      ) : <Empty />}

      <NumberButton value={0} disabled={disabled} onPressed={onNumberPressed} />

      {!!onBackspacePressed && (
        <TouchableOpacity onPress={onBackspacePressed}>
          <VCol alignItems={'center'} justifyContent={'center'} height={theme.number.sWidth?.lg}
            width={theme.number.sWidth?.lg} margin={theme.number.sMargin?.xs}>
            <VCol bg={VThemeUtil.colorPick(theme.number.cBg)} radius={theme.number.sWidth?.lg! / 2}
              style={styles.rightButton}>
              <VIcon name={'backspace'} color={VThemeUtil.colorPick(theme.number.cMain)} fontSize={20}
                style={styles.backspace} />
            </VCol>
          </VCol>
        </TouchableOpacity>
      )}
    </VRow>
  );
};

const NumberButton: React.FC<{ value: number; disabled: boolean; onPressed: (value: number) => void }> = (props) => {
  const [store] = useTheme();
  const theme = store.kit.PinPad;
  const { value, disabled, onPressed } = props;
  const pressingHandler = useCallback(() => onPressed(value), [value, onPressed]);

  return (
    <TouchableOpacity onPress={pressingHandler} disabled={disabled}>
      <VCol
        alignItems={'center'}
        justifyContent={'center'}
        width={theme.number.sWidth?.lg}
        height={theme.number.sWidth?.lg}
        radius={theme.number.sWidth?.lg! / 2}
        bg={disabled ? VThemeUtil.colorPick(theme.number.cDisabled) : VThemeUtil.colorPick(theme.number.cBg)}
        margin={theme.number.sMargin?.xs}
      >
        <VText mt={'sm'} font={'title2'} color={VThemeUtil.colorPick(theme.number.cText)}>{value}</VText>
      </VCol>
    </TouchableOpacity>
  );
};

const IconButton: React.FC<{ name: TVIconName; closeIcon?: boolean; disabled: boolean; onPressed: () => void }> = (props) => {
  const [store] = useTheme();
  const theme = store.kit.PinPad;
  const { name, closeIcon, disabled, onPressed } = props;

  return (
    <VTouchable.Opacity onPress={onPressed} disabled={disabled}>
      <VCol
        alignItems={'center'}
        justifyContent={'center'}
        width={theme.number.sWidth?.lg}
        height={theme.number.sWidth?.lg}
        radius={theme.number.sWidth?.lg! / 2}
        margin={theme.number.sMargin?.xs}
      >
        <VIcon name={name}
          color={disabled ? VThemeUtil.colorPick(theme.number.cDisabled) : VThemeUtil.colorPick(theme.number.cBg)}
          fontSize={45} />
        {closeIcon && (
          <VIcon name={'close'} absolute color={VThemeUtil.colorPick(theme.icon.cMain)} fontSize={9} pl={'sm'}
            pt={'xs'} />
        )}
      </VCol>
    </VTouchable.Opacity>
  );
};

const Empty: React.FC = () => {
  const [store] = useTheme();
  const theme = store.kit.PinPad;

  return (
    <VCol
      alignItems={'center'}
      justifyContent={'center'}
      width={theme.number.sWidth?.lg}
      height={theme.number.sWidth?.lg}
      radius={theme.number.sWidth?.lg! / 2}
      margin={theme.number.sMargin?.xs}
    />
  );
};
