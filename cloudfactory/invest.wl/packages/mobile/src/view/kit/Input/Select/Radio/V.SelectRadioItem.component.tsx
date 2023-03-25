import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { MathUtil } from '../../../../../../../common/src/util/math.util';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { VCol, VRow } from '../../../Layout/Flex';
import { VIcon } from '../../../Output/Icon';
import { VText } from '../../../Output/Text';
import { VTooltip } from '../../../Output/Tooltip';
import { IVTouchableProps, VTouchable } from '../../Touchable';

interface IVSelectRadioItemProps extends IVTouchableProps {
  isChecked?: boolean;
  text?: string;
  hint?: string;
  reverse?: boolean;
}

@observer
export class VSelectRadioItem extends React.Component<IVSelectRadioItemProps> {
  public static Unchecked = (props: any) => <>{props.children}</>;
  public static Checked = (props: any) => <>{props.children}</>;
  public static Text = (props: any) => <>{props.children}</>;

  protected theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { isChecked, text, hint, children, reverse, ...touchableProps } = this.props;
    const theme = this.theme.kit.Select.Radio;
    const isGradient = Array.isArray(theme.checked.cBg);

    return (
      <VTouchable.Opacity pv={theme.sPadding?.md} {...touchableProps}>
        <VRow alignItems={'center'} reverse={reverse}>
          {isChecked ? (
            <CompoundUtils.Find peers={children} byPeerType={VSelectRadioItem.Checked}>{e => !!e ? (
              <VSelectRadioItem.Checked {...e.props} />
            ) : (isGradient ? (
              <LinearGradient colors={theme.checked.cBg as string[]} style={{
                justifyContent: 'center', alignItems: 'center',
                borderRadius: theme.checked.sRadius?.md,
                width: theme.checked.sWidth?.md, height: theme.checked.sHeight?.md,
                borderWidth: theme.checked.sBorder?.md, borderColor: VThemeUtil.colorPick(theme.checked.cBorder),
              }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <VIcon name={'checkmark'} color={VThemeUtil.colorPick(theme.checked.cText)}
                  fontSize={theme.checked.sFont?.md} />
              </LinearGradient>
            ) : (
              <VCol width={theme.checked.sWidth?.md} height={theme.checked.sHeight?.md}
                radius={theme.checked.sRadius?.md} bg={VThemeUtil.colorPick(theme.checked.cBg)}
                borderWidth={theme.checked.sBorder?.md} borderColor={VThemeUtil.colorPick(theme.checked.cBorder)}
                justifyContent={'center'} alignItems={'center'}>
                <VCol width={MathUtil.divide(theme.checked.sWidth?.md, 2)}
                  height={MathUtil.divide(theme.checked.sHeight?.md, 2)}
                  radius={MathUtil.divide(theme.checked.sRadius?.md, 2)}
                  bg={VThemeUtil.colorPick(theme.checked.cBorder)} />
              </VCol>
            )
            )}</CompoundUtils.Find>
          ) : (
            <CompoundUtils.Find peers={children} byPeerType={VSelectRadioItem.Unchecked}>{e => !!e ? (
              <VSelectRadioItem.Unchecked {...e.props} />
            ) : (
              <VCol width={theme.unchecked.sWidth?.md} height={theme.unchecked.sHeight?.md}
                radius={theme.unchecked.sRadius?.md} bg={VThemeUtil.colorPick(theme.unchecked.cBg)}
                borderWidth={theme.unchecked.sBorder?.md} borderColor={VThemeUtil.colorPick(theme.unchecked.cBorder)} />
            )}</CompoundUtils.Find>
          )}

          <VCol flex ml={reverse ? undefined : theme.text.sMargin?.md}>
            <CompoundUtils.Find peers={children} byPeerType={VSelectRadioItem.Text}>{e => !!e ? (
              <VSelectRadioItem.Text {...e.props} />
            ) : (
              <>
                <VText style={theme.text.fText}
                  color={VThemeUtil.colorPick(isChecked ? theme.text.cActive : theme.text.cInactive)}>
                  {text}
                </VText>
                {!!hint && (
                  <VCol absolute top right zIndex={2}>
                    <VTooltip text={hint}><VTooltip.HintIcon /></VTooltip>
                  </VCol>
                )}
              </>
            )}</CompoundUtils.Find>
          </VCol>
        </VRow>
      </VTouchable.Opacity>
    );
  }
}

