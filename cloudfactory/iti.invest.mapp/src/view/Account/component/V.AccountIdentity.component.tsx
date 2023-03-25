import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, IVTextProps, VCol, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { IVAccountIdentityMpart } from '@invest.wl/view/src/Account/mpart/V.AccountIdentity.mpart';
import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils';
import { IoC } from '@invest.wl/core';
import { IVThemeStore, VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';

export interface IVAccountIdentityProps extends IVFlexProps {
  mpart: IVAccountIdentityMpart;
}

@observer
export class VAccountIdentity extends React.Component<IVAccountIdentityProps> {
  public static TypeRight = (_: IVTextProps) => null;

  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);

  public render() {
    const { mpart, children, ...flexProps } = this.props;
    const { color, space } = this._theme;

    return (
      <VCol justifyContent={'space-between'} {...flexProps}>
        <VRow alignItems={'flex-end'}>
          <VText font={'body5'} runningLine>{mpart.marketType}</VText>
          <CompoundUtils.Find peers={children} byPeerType={VAccountIdentity.TypeRight}>{e => !!e && (
            <VText {...e.props} />
          )}</CompoundUtils.Find>
        </VRow>
        <VText mt={space.sm} font={'body19'} color={color.muted3} runningLine>{mpart.name}</VText>
      </VCol>
    );
  }
}
