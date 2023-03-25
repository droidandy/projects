import React from 'react';
import { observer } from 'mobx-react';
import { IVInstrumentAlertModel } from '@invest.wl/view/src/InstrumentAlert/model/V.InstrumentAlert.model';
import {
  IVFlexProps, VCol, VFormat, VIcon, VList, VProgressBar, VSwipeableRow, VText, VTouchable,
} from '@invest.wl/mobile/src/view/kit';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VInstrumentIdentity } from '../../Instrument/component/V.InstrumentIdentity.component';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { IVInstrumentPresentProps } from '@invest.wl/view/src/Instrument/present/V.Instrument.present';

export interface IVInstrumentAlertItemProps extends IVFlexProps {
  model: IVInstrumentAlertModel;
  onCancel?(item: IVInstrumentAlertModel): Promise<void> | void;
}

@observer
export class VInstrumentAlertItem extends React.Component<IVInstrumentAlertItemProps> {
  private static _actionButtonSize = 80;

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVInstrumentAlertItemProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model, onCancel } = this.props;

    if (model.domain.isCompleted || !onCancel) return this._contentRender;
    return (
      <VSwipeableRow rightContent={this._renderActions}>
        {this._contentRender}
      </VSwipeableRow>
    );
  }

  @computed
  private get _contentRender() {
    const { model, onCancel, ...flexProps } = this.props;
    const { space, font, color, kit } = this.theme;

    return (
      <VTouchable.Opacity activeOpacity={1} onPress={this._instrumentNav}>
        <VCol bg={color.base} pa={space.lg} {...flexProps}>
          <VInstrumentIdentity flex mpart={model.instrumentIdentity}>
            <VInstrumentIdentity.RightBottom mt={space.sm} alignItems={'stretch'}>
              {!model.domain.isCompleted && (
                <>
                  <VFormat.Number>{model.lastPrice}</VFormat.Number>
                  <VIcon name={'arrow-normal'} mh={space.sm} color={color.text} fontSize={14} />
                </>
              )}
              <VFormat.Number>{model.targetPrice}</VFormat.Number>
            </VInstrumentIdentity.RightBottom>
          </VInstrumentIdentity>
          {!model.domain.isCompleted && (
            <>
              <VText ml={(kit.Thumbnail.sWidth?.md || 0) + space.md} style={font.body20} color={color.muted4}
              >Осталось до исполнения <VText color={color.primary1}
                >{`${model.pointToTargetPrice} (${model.percentToTargetPrice})`}</VText>
              </VText>
              <VProgressBar absolute bottom={0} left={space.lg} width={'100%'} percent={model.domain.completePercent} />
            </>
          )}
          {model.domain.isCompleted && (
            <>
              <VText ml={(kit.Thumbnail.sWidth?.md || 0) + space.md} style={font.body20}
                color={color.muted4}>Исполнено: <VText color={color.text}
                >{`${model.date}`}</VText>
              </VText>
              <VList.Separator absolute bottom={0} left={space.lg} width={'100%'} mh={0} />
            </>
          )}
        </VCol>
      </VTouchable.Opacity>
    );
  }

  @computed
  private get _renderActions() {
    const { model, onCancel } = this.props;
    const { color, space } = this.theme;

    return (
      <VTouchable.Opacity justifyContent={'center'} alignItems={'center'}
        width={VInstrumentAlertItem._actionButtonSize} height={VInstrumentAlertItem._actionButtonSize}
        bg={color.primary1} radius={15} ml={space.md} mr={space.lg} alignSelf={'center'}
        context={model} onPress={onCancel}>
        <VText color={color.base} font={'body16'}>Снять</VText>
      </VTouchable.Opacity>
    );
  };

  private _instrumentNav = () => this.router.navigateTo(EVInstrumentScreen.Instrument,
    { cid: this.props.model.instrumentIdentity.dto.id } as IVInstrumentPresentProps);
}
