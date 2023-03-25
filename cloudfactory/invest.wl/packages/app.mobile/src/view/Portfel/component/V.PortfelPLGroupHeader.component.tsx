import { EDCurrencyCode, IoC } from '@invest.wl/core';
import { IVFlexProps, VButton, VCol, VIcon, VRow, VText } from '@invest.wl/mobile';
import { TVIconName } from '@invest.wl/view/src/Icon/V.Icon.types';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VPortfelPLGroupStat } from './V.PortfelPLGrouptStat.component';

export interface IVPortfelPLGroupHeader extends IVFlexProps {
  model: VPortfelPLGroupModel;
  currency: EDCurrencyCode;
  onCurrency?(): void;
}

@observer
export class VPortfelPLGroupHeader extends React.Component<IVPortfelPLGroupHeader> {
  public static currency2iconMap: { [C in keyof typeof EDCurrencyCode]?: TVIconName } = {
    [EDCurrencyCode.RUR]: 'rubl',
    [EDCurrencyCode.EUR]: 'euro',
    [EDCurrencyCode.USD]: 'dollar',
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { model, children, currency, onCurrency, ...flexProps } = this.props;
    const { color, space } = this.theme;

    return (
      <VRow justifyContent={'space-between'} alignItems={'center'} {...flexProps}>
        <VCol>
          <VText mb={space.sm}>Оценка активов</VText>
          <VPortfelPLGroupStat size={'lg'} model={model} />
        </VCol>
        <VButton.Fill color={color.accent2} width={41} height={30} onPress={onCurrency}>
          <VIcon name={VPortfelPLGroupHeader.currency2iconMap[currency] || 'help'} fontSize={20} />
        </VButton.Fill>
      </VRow>
    );
  }
}
