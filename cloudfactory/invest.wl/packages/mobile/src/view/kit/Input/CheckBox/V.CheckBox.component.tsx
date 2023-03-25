import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { VCol, VRow } from '../../Layout/Flex';
import { VIcon } from '../../Output/Icon';
import { VText } from '../../Output/Text';

import { IVTouchableProps, VTouchable } from '../Touchable';

export interface IVCheckBoxProps extends IVTouchableProps {
  isChecked?: boolean;
  text?: string;
}

export class VCheckBox extends React.Component<IVCheckBoxProps> {
  public static Unchecked = (props: any) => <>{props.children}</>;
  public static Checked = (props: any) => <>{props.children}</>;
  public static Text = (props: any) => <>{props.children}</>;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { isChecked, text, children, ...touchableProps } = this.props;
    const theme = this.theme.kit.CheckBox;

    return (
      <VTouchable.Opacity {...touchableProps}>
        <VRow alignItems={'center'}>
          {isChecked ? (
            <CompoundUtils.Find peers={children} byPeerType={VCheckBox.Checked}>{e => !!e ? (
              <VCheckBox.Checked {...e.props} />
            ) : (
              <VCol width={theme.sWidth?.md} height={theme.sHeight?.md} radius={theme.sRadius?.md}
                bg={VThemeUtil.colorPick(theme.cActive)} alignItems={'center'} justifyContent={'center'}>
                <VIcon name={'checkmark'} fontSize={theme.icon.sFont?.md}
                  color={VThemeUtil.colorPick(theme.icon.cMain)} />
              </VCol>
            )}</CompoundUtils.Find>
          ) : (
            <CompoundUtils.Find peers={children} byPeerType={VCheckBox.Unchecked}>{e => !!e ? (
              <VCheckBox.Unchecked {...e.props} />
            ) : (
              <VCol width={theme.sWidth?.md} height={theme.sHeight?.md} radius={theme.sRadius?.md}
                borderWidth={theme.sBorder?.md} borderColor={VThemeUtil.colorPick(theme.cInactive)} />
            )}</CompoundUtils.Find>
          )}
          <VCol flex>
            <CompoundUtils.Find peers={children} byPeerType={VCheckBox.Text}>{e => !!e ? (
              <VCheckBox.Text {...e.props} />
            ) : (
              <VText ml={theme.text.sMargin?.md} style={theme.text.fText}
                color={VThemeUtil.colorPick(isChecked ? theme.text.cActive : theme.text.cInactive)}>
                {text}
              </VText>
            )}</CompoundUtils.Find>
          </VCol>
        </VRow>
      </VTouchable.Opacity>
    );
  }
}
