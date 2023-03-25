import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import React from 'react';
import { themeStyle, VThemeUtil } from '../../../Theme/V.Theme.util';

import { VTouchable } from '../../Input/Touchable';
import { IVFlexProps } from '../../Layout/Flex';
import { flexView } from '../../Layout/Flex/V.Flex.util';
import { VIcon } from '../../Output/Icon';
import { IVIconProps } from '../../Output/Icon/V.Icon.types';

export interface IVNavBarIconProps extends IVIconProps, IVFlexProps {
  onPress?(): void;
}

@flexView()
export class VNavBarIcon extends React.Component<IVNavBarIconProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.NavBarIcon;
    const { name, onPress, style, ...props } = this.props;

    return (
      <VTouchable.Opacity justifyContent={'center'} alignItems={'center'}
        hitSlop={themeStyle.hitSlop16} onPress={onPress} style={style}>
        <VIcon name={name} fontSize={theme.sFont?.md} color={VThemeUtil.colorPick(theme.cMain)} {...props} />
      </VTouchable.Opacity>
    );
  }
}
