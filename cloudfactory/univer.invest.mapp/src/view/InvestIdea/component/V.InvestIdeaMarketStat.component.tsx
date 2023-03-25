import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VCard, VCol, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IVInvestIdeaModel } from '@invest.wl/view/src/InvestIdea/model/V.InvestIdea.model';

export interface IVInvestIdeaMarketStatProps extends IVFlexProps {
  model: IVInvestIdeaModel;
}

@observer
export class VInvestIdeaMarketStat extends React.Component<IVInvestIdeaMarketStatProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { model, ...flexProps } = this.props;
    const { space } = this._theme;
    if (!model.instrumentStat) return null;

    return (
      <VCard pa={space.lg} {...flexProps}>
        <VRow justifyContent={'space-between'} alignItems={'center'}>
          {model.instrumentStat.map(s => (
            <VCol flexGrow={1} flexShrink={1} key={s.name} alignItems={'center'} justifyContent={'center'}>
              <VText font={'body22'}>{s.name}</VText>
              <VText mt={space.sm} font={'body16'}>{s.value}</VText>
            </VCol>
          ))}
        </VRow>
      </VCard>
    );
  }
}
