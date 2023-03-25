import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { EDOrderCreateCan, EDTradeDirection, IDInstrumentId, IoC } from '@invest.wl/core';
import { IVFlexProps, VButton, VCol, VModalDialog, VRow, VStubLoading, VText } from '@invest.wl/mobile';
import { EVOwnerScreen, VOrderCreateCanPresent, VOrderCreateCanPresentTid } from '@invest.wl/view';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IVTradeI18n, VTradeI18nTid } from '@invest.wl/view/src/Trade/V.Trade.types';
import { action, computed, makeObservable, when } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVOrderCreateButtonsProps extends IVFlexProps {
  cid: IDInstrumentId;
  exchangeShow?: boolean;
  // TODO:
  onPressOpenAccount?(): void;
}

@observer
export class VOrderCreateButtons extends React.Component<IVOrderCreateButtonsProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _tradeI18n = IoC.get<IVTradeI18n>(VTradeI18nTid);

  private _pr = IoC.get<VOrderCreateCanPresent>(VOrderCreateCanPresentTid);

  private toggleAccountOpen = new ToggleX();
  private toggleOrderCannot = new ToggleX();

  @computed
  public get summary() {
    return this._pr.instrumentSummaryX.model;
  }

  public componentDidMount() {
    this._pr.init({ cid: this.props.cid });
    // нужно дёрнуть это свойство чтобы заранее подгрузились все необходимые данные
    when(() => !!this._pr.instrumentSummaryX.model?.domain.orderCan);
  }

  constructor(props: IVOrderCreateButtonsProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { exchangeShow, ...flexProps } = this.props;
    const { color, space, font } = this._theme;

    if (!this.summary) return <VStubLoading {...flexProps} />;
    if (this.summary.info.isIndex) return null;
    if (this.summary.domain.orderCan === EDOrderCreateCan.ErrorSessionClosed) {
      return (
        <VRow justifyContent={'center'} {...flexProps}>
          <VText pv={space.md} style={font.body14} ta={'center'}>{this.summary.tradeOpenAt}</VText>
        </VRow>
      );
    }
    return (
      <VCol {...flexProps}>
        <VRow>
          <VButton.Fill size={'lg'} flex color={color.accent1} context={EDTradeDirection.Sell}
            onPress={this.onPress} disabled={this.summary.buyButtonDisabled}>
            {this._tradeI18n.directionAction[EDTradeDirection.Sell].toUpperCase()}
          </VButton.Fill>
          <VButton.Fill size={'lg'} flex ml={space.lg} color={color.primary2} context={EDTradeDirection.Buy}
            onPress={this.onPress} disabled={this.summary.sellButtonDisabled}>
            {this._tradeI18n.directionAction[EDTradeDirection.Buy].toUpperCase()}
          </VButton.Fill>
        </VRow>
        {!!exchangeShow && (
          <VButton.Stroke mt={space.lg} color={color.accent1} onPress={this._exchangeNav}>Открыть очередь
            заявок</VButton.Stroke>
        )}
        {this._renderAccountOpen}
        {this._renderOrderCannot}
      </VCol>
    );
  }

  @computed
  private get _renderAccountOpen() {
    const { color, space, kit } = this._theme;

    return (
      <VModalDialog isVisible={this.toggleAccountOpen.isOpen} animationDuration={0}
        onClose={this.toggleAccountOpen.close}>
        <VModalDialog.Text pa={space.lg}
          text={'Войдите в учётную запись, чтобы\nполучить доступ к торговле\nданным активом'} />
        <VModalDialog.Actions>
          <VButton.Fill flex radius={0} color={color.accent2}
            leftBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.props.onPressOpenAccount}>Открыть счёт</VButton.Fill>
          <VButton.Stroke flex radius={0} color={color.accent2}
            rightBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.toggleAccountOpen.close}>Не сейчас</VButton.Stroke>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  @computed
  private get _renderOrderCannot() {
    const { color, space, kit } = this._theme;

    return (
      <VModalDialog isVisible={this.toggleOrderCannot.isOpen} animationDuration={0}
        onClose={this.toggleOrderCannot.close}>
        <VModalDialog.Title pa={space.lg} pb={0}
          text={'Операция недоступна'} />
        <VModalDialog.Text text={this.summary?.orderCannotText} pa={space.lg} />
        <VModalDialog.Actions>
          <VButton.Stroke flex radius={0} color={color.accent2}
            leftBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.toggleOrderCannot.close}>Отмена</VButton.Stroke>
          <VButton.Fill flex radius={0} color={color.primary2}
            rightBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.onContactSupportPress}>Поддержка</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  @action
  public onPress = (direction: EDTradeDirection) => {
    if (!this.summary ||
      ![EDOrderCreateCan.OK, EDOrderCreateCan.IsOTC, EDOrderCreateCan.NotAllowedToBuy].includes(this.summary.domain.orderCan as EDOrderCreateCan)) {
      this.toggleOrderCannot.open();
    } else {
      this._router.navigateTo(EVOrderScreen.OrderCreate, {
        cid: this.summary.domain.dto.Instrument.id, direction,
      });
    }
  };

  public onContactSupportPress = () => this._router.navigateTo(EVOwnerScreen.OwnerInfo);

  private _exchangeNav = () => this._router.navigateTo(EVInstrumentScreen.InstrumentExchange, {
    cid: this.summary!.domain.dto.Instrument.id,
  });
}
