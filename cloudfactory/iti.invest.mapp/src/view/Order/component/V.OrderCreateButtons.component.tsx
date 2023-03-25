import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VButton, VCol, VModalDialog, VRow, VStubLoading, VText } from '@invest.wl/mobile/src/view/kit';
import { EDTradeDirection } from '@invest.wl/core/src/dto/Trade';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { EDOrderCreateCan } from '@invest.wl/core/src/dto/Order';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { action, computed, makeObservable, observable } from 'mobx';
import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { IVInstrumentSummaryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSummary.model';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { IVTradeI18n, VTradeI18nTid } from '@invest.wl/view/src/Trade/V.Trade.types';

export interface IVOrderCreateButtonsProps extends IVFlexProps {
  summary?: IVInstrumentSummaryModel;
  exchangeShow?: boolean;
  // TODO:
  onPressOpenAccount?(): void;
}

@observer
export class VOrderCreateButtons extends React.Component<IVOrderCreateButtonsProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _tradeI18n = IoC.get<IVTradeI18n>(VTradeI18nTid);

  @observable private _tradeDirection: EDTradeDirection = EDTradeDirection.Buy;

  constructor(props: IVOrderCreateButtonsProps) {
    super(props);
    makeObservable(this);
  }

  private toggleAccountOpen = new ToggleX();
  private toggleOrderCannot = new ToggleX();

  public render() {
    const { summary, exchangeShow, ...flexProps } = this.props;
    const { color, space, font } = this.theme;

    if (!summary) return <VStubLoading {...flexProps} />;
    if (summary.info.isIndex) return null;
    if (summary.domain.orderCan === EDOrderCreateCan.ErrorSessionClosed) {
      return (
        <VRow justifyContent={'center'} {...flexProps}>
          <VText pv={space.md} style={font.body14} ta={'center'}>{summary.tradeOpenAt}</VText>
        </VRow>
      );
    }
    return (
      <VCol {...flexProps}>
        <VRow>
          <VButton.Fill size={'md'} flex color={color.accent1} context={EDTradeDirection.Buy}
            onPress={this.onPress}>
            {this._tradeI18n.directionAction[EDTradeDirection.Buy]}
          </VButton.Fill>
          <VButton.Stroke size={'md'} flex ml={space.lg}  color={color.accent1} context={EDTradeDirection.Sell} onPress={this.onPress}>
            {this._tradeI18n.directionAction[EDTradeDirection.Sell]}
          </VButton.Stroke>
        </VRow>
        {!!exchangeShow &&
        <VButton.Stroke mt={space.lg} color={color.accent1} onPress={this._exchangeNav}>Открыть очередь
          заявок</VButton.Stroke>}
        {this._renderAccountOpen}
        {this._renderOrderCannot}
      </VCol>
    );
  }

  @computed
  private get _renderAccountOpen() {
    const { color, space, kit } = this.theme;

    return (
      <VModalDialog isVisible={this.toggleAccountOpen.isOpen} animationDuration={0}
        onClose={this.toggleAccountOpen.close}>
        <VModalDialog.Text pa={space.lg}
          text={'Войдите в учётную запись, чтобы\nполучить доступ к торговле\nданным активом'} />
        <VModalDialog.Actions>
          <VButton.Fill flex radius={0} color={color.accent1}
            leftBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.props.onPressOpenAccount}>Открыть счёт</VButton.Fill>
          <VButton.Stroke flex radius={0} color={color.accent1}
            rightBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.toggleAccountOpen.close}>Не сейчас</VButton.Stroke>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  @computed
  private get _renderOrderCannot() {
    const { color, space } = this.theme;

    return (
      <VModalDialog isVisible={this.toggleOrderCannot.isOpen} animationDuration={0}
        onClose={this.toggleOrderCannot.close}>
        <VCol pa={space.lg}>
          <VText ta={'center'} font={'body13'}>{this._textCannotOrder}</VText>
          <VCol width mt={space.lg}>
            <VButton.Stroke mt={space.md} color={color.accent1} onPress={this.toggleOrderCannot.close}>
              Закрыть
            </VButton.Stroke>
          </VCol>
        </VCol>
      </VModalDialog>
    );
  }

  @computed
  private get _textCannotOrder() {
    const { summary } = this.props;
    return summary?.domain.orderCan === EDOrderCreateCan.ErrorNoAccount && this._tradeDirection === EDTradeDirection.Buy ?
      'Вы не подключены к торгам' : 'Нет доступных торговых кодов';
  }

  @action
  public onPress = (direction: EDTradeDirection) => {
    const { summary } = this.props;
    if (!summary || summary.domain.orderCan !== EDOrderCreateCan.OK) {
      this._tradeDirection = direction;
      this.toggleOrderCannot.open();
    } else {
      this._router.navigateTo(EVOrderScreen.OrderCreate, {
        cid: summary.domain.dto.Instrument.id, direction,
      });
    }
  };

  private _exchangeNav = () => this._router.navigateTo(EVInstrumentScreen.InstrumentExchange, {
    cid: this.props.summary!.domain.dto.Instrument.id,
  });
}
