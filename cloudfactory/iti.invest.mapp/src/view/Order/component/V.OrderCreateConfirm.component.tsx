import React from 'react';
import { observer } from 'mobx-react';
import { VButton, VCard, VCol, VInputField, VRow, VSpinner, VText } from '@invest.wl/mobile/src/view/kit';
import { VOrderCreateConfirmModel } from '@invest.wl/view/src/Order/model/V.OrderCreateConfirm.model';
import { VInstrumentIdentity } from '../../Instrument/component/V.InstrumentIdentity.component';
import { VInstrumentInfoModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentInfo.model';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VOrderInfoModel } from '@invest.wl/view/src/Order/model/V.OrderInfo.model';
import { Formatter } from '@invest.wl/common/src/util/formatter.util';
import { VOrderCreateModel } from '@invest.wl/view/src/Order/model/V.OrderCreate.model';
import { VTimerBgModel } from '@invest.wl/view/src/Timer/model/V.TimerBg.model';
import { DOrderConfig, DOrderConfigTid } from '@invest.wl/domain/src/Order/D.Order.config';
import { EDOrderConfirmStrategy } from '@invest.wl/domain/src/Order/D.Order.types';
import { action, computed, makeObservable, observable } from 'mobx';
import { VSecurityCheck } from '../../Security/component/Check/V.SecurityCheck.component';
import {
  VSecuritySettingsPresent, VSecuritySettingsPresentTid,
} from '@invest.wl/view/src/Security/present/V.SecuritySettings.present';

export interface IVOrderCreateConfirmProps {
  model: VOrderCreateConfirmModel;
  createModel: VOrderCreateModel;
  instrumentModel: VInstrumentInfoModel;
  timerModel?: VTimerBgModel;
  orderModel?: VOrderInfoModel;
  isConfirming?: boolean;
  onConfirm(): void;
  onCancel(): void;
  onResend?(): void;
}

@observer
export class VOrderCreateConfirm extends React.Component<IVOrderCreateConfirmProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _cfg = IoC.get<DOrderConfig>(DOrderConfigTid);
  private _securitySettingsPr = IoC.get<VSecuritySettingsPresent>(VSecuritySettingsPresentTid);

  @observable private _securityConfirmation = false;
  private _date = new Date();

  constructor(props: IVOrderCreateConfirmProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model, instrumentModel, createModel } = this.props;
    const { space, color } = this._theme;

    return (
      <VCol flex>
        <VRow alignItems={'center'} justifyContent={'space-between'} mb={space.xl}>
          <VInstrumentIdentity flex mpart={instrumentModel.identity} />
          <VCol alignItems={'flex-end'}>
            <VText font={'body20'} mb={space.sm}>{model.humanId}</VText>
            <VText font={'body20'} color={color.muted3}>{Formatter.date(this._date, { pattern: 'time' })}</VText>
          </VCol>
        </VRow>

        {createModel.summary.map((i, index) => (
          <VRow key={index} justifyContent={'space-between'} alignItems={'center'} mb={space.lg}>
            <VText font={'body5'} color={color.muted3}>{i.key}</VText>
            <VText font={'body5'}>{i.value}</VText>
          </VRow>
        ))}

        {this._cfg.confirmStrategy === EDOrderConfirmStrategy.SMS && this._smsRender}
        {[EDOrderConfirmStrategy.Simple, EDOrderConfirmStrategy.Security].includes(this._cfg.confirmStrategy) && this._buttonsRender}

        {this._securityUnlockRender}
      </VCol>
    );
  }

  @computed
  private get _buttonsRender() {
    const { onCancel, isConfirming } = this.props;
    const { space } = this._theme;

    return (
      <>
        {this._spacer}
        <VRow>
          <VButton.Stroke flex onPress={onCancel} disabled={isConfirming}>Отменить</VButton.Stroke>
          <VButton.Fill flex ml={space.lg} onPress={this._onConfirm} disabled={isConfirming}>Подтвердить</VButton.Fill>
        </VRow>
      </>
    );
  }

  @computed
  private get _smsRender() {
    const { model, timerModel, onResend, isConfirming } = this.props;
    const { fields: { code } } = model;
    const { space, color } = this._theme;

    return (
      <>
        <VCard pa={space.lg}>
          <VText font={'body5'} mb={space.lg}>Введите код подтверждения, отправленный на номер +7******3525</VText>
          <VInputField error={code.displayErrors} disabled={isConfirming}>
            <VInputField.Label text={'СМС-код'} />
            <VInputField.Input value={code.value} {...code.inputEvents} />
          </VInputField>
          {timerModel && (
            <>
              {!timerModel.domain.isEnded && (
                <VText font={'body19'} color={color.muted3} ta={'center'}>Отправить код ещё раз
                  (через {timerModel.timeToEnd})</VText>
              )}
              {timerModel.domain.isEnded && (
                <VButton.Text onPress={onResend} disabled={isConfirming}>Отправить код ещё раз</VButton.Text>
              )}
            </>
          )}
        </VCard>
        {this._buttonsRender}
      </>
    );
  }

  @computed
  private get _spacer() {
    const { isConfirming } = this.props;
    const { space } = this._theme;

    return (
      <VCol flex minHeight={space.lg}>
        {!!isConfirming && <VSpinner center />}
      </VCol>
    );
  }

  @computed
  private get _securityUnlockRender() {
    const { orderConfirmByBio } = this._securitySettingsPr.cse;
    if (!this._securityConfirmation) return null;
    return (
      <VSecurityCheck onUnlock={this._onUnlock} disableBiometry={!orderConfirmByBio}
        onCancel={this._securityConfirmClose} />
    );
  }

  private _onUnlock = () => {
    this._securityConfirmClose();
    this.props.onConfirm();
  };

  private _onConfirm = () => {
    const { orderConfirmByBio, orderConfirmByCode } = this._securitySettingsPr.cse;
    if (
      this._cfg.confirmStrategy === EDOrderConfirmStrategy.Security && (orderConfirmByBio || orderConfirmByCode)
    ) this._securityConfirmStart();
    else this.props.onConfirm();
  };

  @action
  private _securityConfirmStart = () => this._securityConfirmation = true;

  @action
  private _securityConfirmClose = () => this._securityConfirmation = false;
}
