import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VFormat, VIcon, VRow, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { IVInstrumentQuoteModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentQuote.model';
import { VInstrumentIdentity } from './V.InstrumentIdentity.component';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IVInstrumentSearchModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSearch.model';

type TModel = IVInstrumentQuoteModel | IVInstrumentSearchModel;

export interface IVInstrumentItemProps<M extends TModel> {
  model: M;
  onPress(model: M): void;
}

@observer
export class VInstrumentItem<M extends TModel> extends React.Component<IVInstrumentItemProps<M>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { model, onPress } = this.props;
    const { identity, info, date, maturity } = model;
    const { space, color } = this.theme;

    return (
      <VTouchable.Opacity context={model} onPress={onPress}>
        <VRow justifyContent={'space-between'} ph={space.lg} pt={space.lg} pb={space.md}>
          <VInstrumentIdentity flexGrow={2} flexShrink={1} flex mpart={identity}>
            {model.domain.alertHas && (
              <VInstrumentIdentity.RightTopAdd>
                <VIcon ml={space.xs} fontSize={18} name={'notification'} color={color.accent1} />
              </VInstrumentIdentity.RightTopAdd>
            )}
            <VInstrumentIdentity.RightBottom>
              <VText font={'body18'} color={color.link}>{info.isBond ? maturity : identity.secureCode}</VText>
            </VInstrumentIdentity.RightBottom>
          </VInstrumentIdentity>
          <VCol flex flexGrow={1} flexShrink={2} alignItems={'flex-end'}>
            <VFormat.Number>{info.midRate}</VFormat.Number>
            <VText font={'body18'}
              color={info.changeColor}>{info.changePoint ? `${info.changePoint} (${info.change})` : info.change}</VText>
            {!!date && <VText font={'body20'} color={color.muted3}>{date}</VText>}
          </VCol>
        </VRow>
      </VTouchable.Opacity>
    );
  }
}
