import { EDOrderCreateCan, EDOrderType, EDTradeDirection, IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VCol, VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile';
import { VInstrumentExchangeItemModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentExchangeItem.model';
import {
  IVInstrumentExchangePresentProps, VInstrumentExchangePresent, VInstrumentExchangePresentTid,
} from '@invest.wl/view/src/Instrument/present/V.InstrumentExchange.present';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVOrderCreatePresentProps } from '@invest.wl/view/src/Order/present/V.OrderCreate.present';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VOrderCreateButtons } from '_view/Order/component/V.OrderCreateButtons.component';
import { observer } from 'mobx-react';
import React from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import { VInstrumentExchangeGlass } from '../../component/V.InstrumentExchangeGlass.component';
import { IVOrderCreateCanPresentProps, VInstrumentPresent, VInstrumentPresentTid } from '@invest.wl/view';

export interface IVInstrumentExchangeScreenProps extends IVInstrumentExchangePresentProps, IVOrderCreateCanPresentProps {
}

@mapScreenPropsToProps
@observer
export class VInstrumentExchangeScreen extends React.Component<IVInstrumentExchangeScreenProps & IVLayoutScreenProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _pr = IoC.get<VInstrumentExchangePresent>(VInstrumentExchangePresentTid);
  private _instrumentPr = IoC.get<VInstrumentPresent>(VInstrumentPresentTid);

  private _contentHeight = 0;
  private _contentInnerRef?: ScrollView;
  private _orderCreateButtonRef = React.createRef<VOrderCreateButtons>();

  public componentDidMount() {
    this._pr.init(this.props);
    this._instrumentPr.init(this.props);
  }

  public render() {
    const { inFocus, cid } = this.props;
    const { exchangeListX } = this._pr;
    const { summaryX } = this._instrumentPr;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          {inFocus && <VNavBar.Title runningLine text={summaryX.model?.identity.name || ''} />}
          {inFocus && <VNavBar.TitleSub text={summaryX.model?.identity.secureCode} />}
        </VNavBar>
        <VCol flex onLayout={this._getContentHeight}>
          <VContent innerRef={this._getContentRef} pa={this.theme.space.lg}>
            <VStub mapXList={[exchangeListX]} inFocus={inFocus}>{() => (
              <>
                <VInstrumentExchangeGlass listX={exchangeListX} onPress={this._onExchangePress}
                  onGetGlassCenter={this._onGetGlassCenter} />
                <VOrderCreateButtons ref={this._orderCreateButtonRef} mt={this.theme.space.lg} cid={cid} />
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
    // summary нужно брать именно из _orderCreateButtonRef, там получен AccountList
    const summary = this._orderCreateButtonRef.current?.summary;
    if (!summary || summary.domain.orderCan !== EDOrderCreateCan.OK) return;
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
