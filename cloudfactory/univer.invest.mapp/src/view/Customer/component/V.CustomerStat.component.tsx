import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVFlexProps, VCol, VText } from '@invest.wl/mobile/src/view/kit';

export interface IVCustomerStatsProps extends IVFlexProps {
  name: string;
  value?: string;
}

@observer
export class VCustomerStat extends React.Component<IVCustomerStatsProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { name, value, ...flexProps } = this.props;
    const { space, color } = this._theme;

    return (
      <VCol {...flexProps}>
        <VText color={color.muted4} font={'body19'} pb={space.sm}>{name}</VText>
        <VText font={'body9'}>{value}</VText>
      </VCol>
    );
  }
}
