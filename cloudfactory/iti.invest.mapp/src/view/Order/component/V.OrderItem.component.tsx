import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VOrderItemModel } from '@invest.wl/view/src/Order/model/V.OrderItem.model';
import {
  IVFlexProps, VCol, VFormat, VIcon, VRow, VSwipeableRow, VText, VThumbnail, VTouchable,
} from '@invest.wl/mobile/src/view/kit';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { IVInstrumentPresentProps } from '@invest.wl/view/src/Instrument/present/V.Instrument.present';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

export interface IVOrderItemProps extends IVFlexProps {
  model: VOrderItemModel;
  noImage?: boolean;
  onCancel?(item: VOrderItemModel): Promise<void> | void;
  // платный функционал, активировать по согласованию с владельцем!
  onReplace?(item: VOrderItemModel): Promise<void> | void;
  onRepeat?(item: VOrderItemModel): Promise<void> | void;
}

@observer
export class VOrderItem extends React.Component<IVOrderItemProps> {
  private static _actionButtonSize = 80;

  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVOrderItemProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get isCancelable() {
    return this.props.model.domain.isCancelable && (!!this.props.onCancel || !!this.props.onReplace);
  }

  public render() {
    const { color, space } = this._theme;
    const { model, noImage, ...flexProps } = this.props;

    return (
      <VSwipeableRow rightContent={this._renderActions}>
        <VTouchable.Responder>
          <VTouchable.Opacity activeOpacity={1} onPress={this._instrumentNav}>
            <VRow pa={space.lg} justifyContent={'space-between'} bg={color.bgContent} {...flexProps}>
              <VRow flex>
                {!noImage && <VThumbnail uri={model.instrumentIdentity.imageSrc} mr={space.md} />}
                <VCol flex>
                  <VText font={'body19'}>{model.deal}</VText>
                  <VText mt={space.sm} font={'body5'} runningLine>{model.instrumentIdentity.name}</VText>
                  <VText mt={space.sm + 1} font={'body20'} color={color.muted3} runningLine>Торговый
                    код: {model.tradeCode}</VText>
                  <VRow alignItems={'center'} mt={space.xs}>
                    <VCol height={7} width={7} radius={3.5} bg={model.statusColor} />
                    <VText font={'caption2'} ml={space.sm} color={model.statusColor}>Статус: {model.status}</VText>
                  </VRow>
                </VCol>
              </VRow>
              <VCol pl={space.md} alignItems={'flex-end'}>
                <VFormat.Number>{model.payment}</VFormat.Number>
                <VText font={'body18'} color={color.primary2}>{model.price} / шт.</VText>
                <VText font={'body20'} mt={space.sm} color={color.muted3}>{model.date}</VText>
              </VCol>
            </VRow>
          </VTouchable.Opacity>
        </VTouchable.Responder>
      </VSwipeableRow>
    );
  }

  @computed
  private get _renderActions() {
    if (!this.isCancelable) return;
    const { model, onCancel, onReplace, onRepeat } = this.props;
    const { color, space } = this._theme;

    return (
      <VRow ph={space.lg}>
        {!!onCancel && (
          <VTouchable.Opacity justifyContent={'center'} alignItems={'center'}
            width={VOrderItem._actionButtonSize} height={VOrderItem._actionButtonSize}
            bg={color.negativeLight} radius={15} mr={!!(onReplace || onRepeat) ? space.md : 0} alignSelf={'center'}
            context={model} onPress={onCancel}>
            <VIcon name={'trash'} color={color.base} fontSize={24} />
          </VTouchable.Opacity>
        )}
        {!!onReplace && (
          <VTouchable.Opacity justifyContent={'center'} alignItems={'center'}
            width={VOrderItem._actionButtonSize} height={VOrderItem._actionButtonSize}
            bg={color.text} radius={15} mr={!!onRepeat ? space.md : 0} alignSelf={'center'}
            context={model} onPress={onReplace}>
            <VIcon name={'operation-replace'} color={color.base} fontSize={24} />
          </VTouchable.Opacity>
        )}
        {!!onRepeat && (
          <VTouchable.Opacity justifyContent={'center'} alignItems={'center'}
            width={VOrderItem._actionButtonSize} height={VOrderItem._actionButtonSize}
            bg={color.accent1} radius={15} alignSelf={'center'}
            context={model} onPress={onRepeat}>
            <VIcon name={'operation-replace'} color={color.base} fontSize={24} />
          </VTouchable.Opacity>
        )}
      </VRow>
    );
  };

  private _instrumentNav = () => this.router.push(EVInstrumentScreen.Instrument,
    { cid: this.props.model.instrumentIdentity.dto.id } as IVInstrumentPresentProps);
}
