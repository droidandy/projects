import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { VShadow } from '../../Decoration';
import { IVFlexProps } from '../../Layout/Flex';

export interface VCardProps extends IVFlexProps {
}

export class VCard extends React.Component<VCardProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.Card;
    const { children, elevation, ...flexProps } = this.props;
    return (
      <VShadow radius={theme.sRadius?.md} bg={VThemeUtil.colorPick(theme.cBg)}
        level={elevation || 5} {...flexProps}>{children}</VShadow>
    );
  }
}
