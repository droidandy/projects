import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VButton, VCol, VIcon, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VPortfelPLGroupStat } from './V.PortfelPLGrouptStat.component';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { EDCurrencyCode } from '@invest.wl/core/src/dto/Currency/D.Currency.dto';
import { TVIconName } from '@invest.wl/view/src/Icon/V.Icon.types';

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
        <VButton.Fill color={color.primary1} width={56} height={56} radius={50} onPress={onCurrency}>
          <VIcon name={VPortfelPLGroupHeader.currency2iconMap[currency] || 'help'} fontSize={36} />
        </VButton.Fill>
      </VRow>
    );
  }
}
