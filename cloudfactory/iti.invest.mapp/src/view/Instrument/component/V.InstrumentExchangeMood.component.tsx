import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VButton, VCol, VIcon, VProgressBar, VRow, VStub, VText } from '@invest.wl/mobile/src/view/kit';
import { IVMapX } from '@invest.wl/common/src/reactive/MapX/MapX.types';
import { IoC } from '@invest.wl/core';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VInstrumentExchangeListModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentExchangeList.model';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { VInstrumentSummaryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSummary.model';

export interface IVInstrumentExchangeMoodProps extends IVFlexProps {
  listX: IVMapX<VInstrumentExchangeListModel>;
  summaryModel: VInstrumentSummaryModel;
}

@observer
export class VInstrumentExchangeMood extends React.Component<IVInstrumentExchangeMoodProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVInstrumentExchangeMoodProps) {
    super(props);
  }

  public render() {
    const { listX, ...flexProps } = this.props;
    const { space } = this.theme;
    return (
      <VCol {...flexProps}>
        <VStub mapXList={[listX]}>
          {() => (
            <>
              <VText font={'body5'} mb={space.md}>Настроения трейдеров</VText>
              <VRow justifyContent={'space-between'}>
                <VCol>
                  <VRow alignItems={'center'}>
                    <VIcon name={'arrow-up'} color={this.theme.color.positive} />
                    <VText>{listX.model!.bidVolumePercent}</VText>
                  </VRow>
                  <VText font={'body20'}>в рост</VText>
                </VCol>
                <VCol alignItems={'flex-end'}>
                  <VRow alignItems={'center'}>
                    <VIcon name={'arrow-down'} color={this.theme.color.negativeLight} />
                    <VText>{listX.model!.askVolumePercent}</VText>
                  </VRow>
                  <VText font={'body20'}>в снижение</VText>
                </VCol>
              </VRow>
              <VProgressBar mv={this.theme.space.md} percent={listX.model!.domain.bidVolumePercent} text />
              <VButton.Fill mt={space.md} onPress={this._exchangeNav}>Стакан</VButton.Fill>
            </>
          )}
        </VStub>
      </VCol>
    );
  }

  private _exchangeNav = () => this.router.navigateTo(EVInstrumentScreen.InstrumentExchange, {
    cid: this.props.summaryModel.domain.dto.Instrument.id,
  });
}
