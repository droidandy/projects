import React from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { VCol, VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile/src/view/kit';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import {
  IVInstrumentExchangePresentProps, VInstrumentExchangePresent, VInstrumentExchangePresentTid,
} from '@invest.wl/view/src/Instrument/present/V.InstrumentExchange.present';
import { VInstrumentExchangeGlass } from '../../component/V.InstrumentExchangeGlass.component';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VOrderCreateButtons } from '_view/Order/component/V.OrderCreateButtons.component';
import { VInstrumentExchangeItemModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentExchangeItem.model';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';
import { IVOrderCreatePresentProps } from '@invest.wl/view/src/Order/present/V.OrderCreate.present';
import { EDOrderCreateCan, EDOrderType } from '@invest.wl/core/src/dto/Order';
import { when } from 'mobx';
import { EDTradeDirection } from '@invest.wl/core';

export interface IVInstrumentExchangeScreenProps extends IVInstrumentExchangePresentProps {
}

@mapScreenPropsToProps
@observer
export class VInstrumentExchangeScreen extends React.Component<IVInstrumentExchangeScreenProps & IVLayoutScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _pr = IoC.get<VInstrumentExchangePresent>(VInstrumentExchangePresentTid);

  private _contentHeight = 0;
  private _contentInnerRef?: ScrollView;

  public componentDidMount() {
    this._pr.init(this.props);
    // нужно дёрнуть это свойство чтобы заранее подгрузились все необходимые данные
    when(() => !!this._pr.orderCreateCanPr.instrumentSummaryX.model?.domain.orderCan);
  }

  public render() {
    const { inFocus } = this.props;
    const { exchangeListX, orderCreateCanPr: { instrumentSummaryX } } = this._pr;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          {inFocus && <VNavBar.Title runningLine text={instrumentSummaryX.model?.identity.name || ''} />}
          {inFocus && <VNavBar.TitleSub text={instrumentSummaryX.model?.identity.secureCode} />}
        </VNavBar>
        <VCol flex onLayout={this._getContentHeight}>
          <VContent innerRef={this._getContentRef} pa={this.theme.space.lg}>
            <VStub mapXList={[exchangeListX, instrumentSummaryX]} inFocus={inFocus}>{() => (
              <>
                <VInstrumentExchangeGlass listX={exchangeListX} onPress={this._onExchangePress}
                  onGetGlassCenter={this._onGetGlassCenter} />
                <VOrderCreateButtons mt={this.theme.space.lg} summary={instrumentSummaryX.model!} />
              </>
            )}</VStub>
          </VContent>
        </VCol>
      </VContainer>
    );
  }

  private _getContentHeight = (e: LayoutChangeEvent) => this._contentHeight = e.nativeEvent.layout.height;

  private _getContentRef = (ref: ScrollView) => this._contentInnerRef = ref;

  private _onGetGlassCenter = (position: number) =>
    this._contentInnerRef?.scrollTo({
      x: 0, y: position - this._contentHeight / 2 + this.theme.space.lg, animated: true,
    });

  private _onExchangePress = (item: VInstrumentExchangeItemModel) => {
    const summary = this._pr.orderCreateCanPr.instrumentSummaryX.model!;
    if (summary.domain.orderCan !== EDOrderCreateCan.OK) return;
    const instrument = summary.domain.dto.Instrument;
    const direction = item.domain.tradeDirection === EDTradeDirection.Buy ? EDTradeDirection.Sell : EDTradeDirection.Buy;
    this.router.navigateTo(EVOrderScreen.OrderCreate, {
      cid: instrument.id, direction,
      dto: {
        type: EDOrderType.LMT, price: Math.abs(item.domain.price), instrument: instrument.id.toJSON(),
        bs: direction,
      },
    } as IVOrderCreatePresentProps);
  };
}
