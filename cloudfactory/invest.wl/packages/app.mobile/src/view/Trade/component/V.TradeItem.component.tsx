import { IoC } from '@invest.wl/core';
import { VCol, VFormat, VRow, VText, VThumbnail, VTouchable } from '@invest.wl/mobile';
import { IVInstrumentPresentProps } from '@invest.wl/view/src/Instrument/present/V.Instrument.present';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VTradeModel } from '@invest.wl/view/src/Trade/model/V.Trade.model';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVTradeItemProps {
  model: VTradeModel;
}

@observer
export class VTradeItem extends React.Component<IVTradeItemProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);

  public render() {
    const { color, space } = this._theme;
    const { model } = this.props;

    return (
      <VTouchable.Opacity activeOpacity={1} onPress={this._instrumentNav}>
        <VRow pa={space.lg} justifyContent={'space-between'} bg={color.bgContent}>
          <VRow flex>
            <VThumbnail uri={model.instrumentIdentity.imageSrc} mr={space.md} />
            <VCol flex>
              <VText font={'body19'}>{model.deal}</VText>
              <VText mt={space.sm} font={'body5'} runningLine>{model.instrumentIdentity.name}</VText>
              <VText mt={space.sm + 1} font={'body20'} color={color.muted3} runningLine>Торговый код: {model.tradeCode}</VText>
            </VCol>
          </VRow>
          <VCol pl={space.md} alignItems={'flex-end'}>
            <VFormat.Number>{model.payment}</VFormat.Number>
            <VText font={'body18'} color={color.primary2}>{model.price} / шт.</VText>
            <VText font={'body20'} mt={space.sm} color={color.muted3}>{model.date}</VText>
          </VCol>
        </VRow>
      </VTouchable.Opacity>
    );
  }

  private _instrumentNav = () => this.router.push(EVInstrumentScreen.Instrument,
    { cid: this.props.model.instrumentIdentity.dto.id } as IVInstrumentPresentProps);
}
