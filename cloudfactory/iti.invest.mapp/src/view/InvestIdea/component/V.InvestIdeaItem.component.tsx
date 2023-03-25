import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VCard, VCol, VFormat, VRow, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VInstrumentIdentity } from '../../Instrument/component/V.InstrumentIdentity.component';
import { IVInvestIdeaItemModel } from '@invest.wl/view/src/InvestIdea/model/V.InvestIdeaItem.model';

export interface IVInvestIdeaItemProps extends IVFlexProps {
  model: IVInvestIdeaItemModel;
  strategyShow: boolean;
  onPress?(model: IVInvestIdeaItemModel): void;
  instrumentOnPress?(model: IVInvestIdeaItemModel): void;
}

@observer
export class VInvestIdeaItem extends React.Component<IVInvestIdeaItemProps> {
  public static defaultProps = {
    strategyShow: true,
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { space, color } = this.theme;
    const { model, onPress, instrumentOnPress, strategyShow, ...flexProps } = this.props;
    const { identity, instrumentIdentity, instrumentInfo } = model;

    return (
      <VCard {...flexProps}>
        <VTouchable.Opacity context={model} onPress={onPress} disabled={!onPress} pa={space.lg}>
          <VText font={'body3'}>{identity.title}</VText>
          {strategyShow && <VText mt={space.md} font={'body13'} numberOfLines={2}>{model.strategy}</VText>}
          <VText mt={space.lg} font={'body22'} color={color.muted3}>{`Дата публикации: ${model.openDate}`}</VText>
          {!!instrumentInfo && !!instrumentIdentity && (
            <VTouchable.Opacity context={model} onPress={instrumentOnPress} disabled={!instrumentOnPress}>
              <VCol mv={space.lg} mh={-space.lg} height={1} bg={color.muted1} />
              <VRow justifyContent={'space-between'} alignItems={'center'}>
                <VInstrumentIdentity flexGrow={2} flexShrink={1} mpart={instrumentIdentity} />
                <VCol ml={space.md} alignItems={'flex-end'}>
                  <VFormat.Number>{instrumentInfo.midRate}</VFormat.Number>
                  <VText font={'body18'} color={instrumentInfo.changeColor}>{
                    instrumentInfo.changePoint ? `${instrumentInfo.changePoint} (${instrumentInfo.change})` : instrumentInfo.change}</VText>
                </VCol>
              </VRow>
            </VTouchable.Opacity>
          )}
        </VTouchable.Opacity>
      </VCard>
    );
  }
}
