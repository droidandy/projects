import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import React from 'react';
import { themeStyle, VThemeUtil } from '../../../Theme/V.Theme.util';

import { VTouchable } from '../../Input/Touchable';
import { IVTextProps, VText } from '../../Output/Text';

export interface IVNavBarTextProps extends IVTextProps {
  title: string;
  onPress?(): void;
}

export class VNavBarText extends React.Component<IVNavBarTextProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.NavBarText;
    const { title, onPress, ...props } = this.props;

    return (
      <VTouchable.Opacity justifyContent={'center'} alignItems={'center'}
        hitSlop={themeStyle.hitSlop16} onPress={onPress}>
        <VText style={theme.fText} color={VThemeUtil.colorPick(theme.cText)} {...props}>{title}</VText>
      </VTouchable.Opacity>
    );
  }
}
