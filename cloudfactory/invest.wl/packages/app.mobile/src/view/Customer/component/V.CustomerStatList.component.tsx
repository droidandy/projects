import { IoC } from '@invest.wl/core';
import { IVFlexProps, VCard } from '@invest.wl/mobile';
import { IVCustomerAccountSelfModel } from '@invest.wl/view/src/Customer/model/V.CustomerAccountSelf.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VCustomerStat } from './V.CustomerStat.component';

export interface IVCustomerStatListProps extends IVFlexProps {
  model: IVCustomerAccountSelfModel;
}

@observer
export class VCustomerStatList extends React.Component<IVCustomerStatListProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { model, ...flexProps } = this.props;
    const { space } = this._theme;

    return (
      <VCard pa={space.lg} {...flexProps}>
        {model.statList.map((item, index) => (
          <VCustomerStat key={item.name} {...item} mt={!!index ? space.md : undefined} />
        ))}
      </VCard>
    );
  }
}
