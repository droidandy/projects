import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVFlexProps, VCard } from '@invest.wl/mobile/src/view/kit';
import { VCustomerStat } from './V.CustomerStat.component';
import { IVCustomerAccountSelfModel } from '@invest.wl/view/src/Customer/model/V.CustomerAccountSelf.model';

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
