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
import { action, computed, makeObservable } from 'mobx';
import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { IVInstrumentSummaryModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSummary.model';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { IVTradeI18n, VTradeI18nTid } from '@invest.wl/view/src/Trade/V.Trade.types';
import { EVOwnerScreen } from '@invest.wl/view/src/Owner/V.Owner.types';

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

  constructor(props: IVOrderCreateButtonsProps) {
    super(props);
    makeObservable(this);
  }

  private toggleAccountOpen = new ToggleX();
  private toggleOrderCannot = new ToggleX();

  public render() {
    const { summary, exchangeShow, ...flexProps } = this.props;
    const { color, space, font } = this.theme;

    if (!summary) {
      return <VStubLoading {...flexProps} />;
    }
    if (summary.info.isIndex) {
      return null;
    }
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
          <VButton.Stroke size={'lg'} flex color={color.primary1} context={EDTradeDirection.Sell}
            onPress={this.onPress} disabled={summary.sellButtonDisabled}>
            {this._tradeI18n.directionAction[EDTradeDirection.Sell].toUpperCase()}
          </VButton.Stroke>
          <VButton.Fill size={'lg'} flex ml={space.lg} color={color.primary1} context={EDTradeDirection.Buy}
            onPress={this.onPress} disabled={summary.buyButtonDisabled}>
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
    const { color, space, kit } = this.theme;

    return (
      <VModalDialog isVisible={this.toggleAccountOpen.isOpen} animationDuration={0}
        onClose={this.toggleAccountOpen.close}>
        <VModalDialog.Text pa={space.lg}
          text={'Войдите в учётную запись, чтобы\nполучить доступ к торговле\nданным активом'} />
        <VModalDialog.Actions>
          <VButton.Fill flex radius={0} color={color.accent2}
            leftBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.props.onPressOpenAccount}>Открыть счёт</VButton.Fill>
          <VButton.Fill flex radius={0} color={color.decorLight} colorText={color.primary1}
            rightBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.toggleAccountOpen.close}>Не сейчас</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  @computed
  private get _renderOrderCannot() {
    const { summary } = this.props;
    const { color, space, kit } = this.theme;

    return (
      <VModalDialog isVisible={this.toggleOrderCannot.isOpen} animationDuration={0}
        onClose={this.toggleOrderCannot.close}>
        <VModalDialog.Title pa={space.lg} pb={0}
          text={'Операция недоступна'} />
        <VModalDialog.Text text={summary?.orderCannotText} pa={space.lg} />
        <VModalDialog.Actions>
          <VButton.Stroke flex radius={0} color={color.accent2}
            leftBottomRadius={kit.ModalDialog.sRadius?.md} onPress={this.toggleOrderCannot.close}>Отмена</VButton.Stroke>
          <VButton.Fill flex radius={0} color={color.primary2}
            rightBottomRadius={kit.ModalDialog.sRadius?.md} onPress={this.onContactSupportPress}>Поддержка</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  @action
  public onPress = (direction: EDTradeDirection) => {
    const { summary } = this.props;
    if (!summary || ![EDOrderCreateCan.OK, EDOrderCreateCan.IsOTC, EDOrderCreateCan.NotAllowedToBuy].includes(summary?.domain.orderCan as EDOrderCreateCan)) {
      this.toggleOrderCannot.open();
    } else {
      this._router.navigateTo(EVOrderScreen.OrderCreate, {
        cid: summary.domain.dto.Instrument.id, direction,
      });
    }
  };

  public onContactSupportPress = () => {
    this._router.navigateTo(EVOwnerScreen.OwnerInfo);
  };

  private _exchangeNav = () => this._router.navigateTo(EVInstrumentScreen.InstrumentExchange, {
    cid: this.props.summary!.domain.dto.Instrument.id,
  });
}
