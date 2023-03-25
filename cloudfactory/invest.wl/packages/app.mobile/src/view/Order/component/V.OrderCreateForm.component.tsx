import { IoC } from '@invest.wl/core';
import {
  VButton, VCol, VFormat, VInputField, VRow, VSelect, VSwitch, VText, VThemeUtil, VTouchable,
} from '@invest.wl/mobile';
import { VAccountQUIKModel } from '@invest.wl/view/src/Account/model/V.AccountQUIK.model';
import { VInstrumentInfoModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentInfo.model';
import { VOrderCreateModel } from '@invest.wl/view/src/Order/model/V.OrderCreate.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VInstrumentIdentity } from '../../Instrument/component/V.InstrumentIdentity.component';

export interface IVOrderCreateProps {
  model: VOrderCreateModel;
  instrumentModel: VInstrumentInfoModel;
  accountModelList: VAccountQUIKModel[];
  onCreate(): void;
}

@observer
export class VOrderCreateForm extends React.Component<IVOrderCreateProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVOrderCreateProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _accountSelectList() {
    return this.props.accountModelList.map(a => ({
      value: a.id, name: a.domain.dto.Name,
    }));
  }

  public render() {
    const theme = this.theme.kit.InputField;
    const { model, instrumentModel, onCreate } = this.props;
    const {
      typeMarket, marketCan, isTypeMarket, nameAction, lotMaxLabel, amountLotSetMax,
      fields: { amount, price, accountId },
    } = model;
    const { space } = this.theme;

    return (
      <VCol flex>
        <VRow alignItems={'center'} justifyContent={'space-between'} mb={space.lg}>
          <VInstrumentIdentity flex mpart={instrumentModel.identity} />
          <VFormat.Number size={'lg'}>{instrumentModel.info.midRate}</VFormat.Number>
        </VRow>

        <VInputField mb={space.lg} error={amount.displayErrors}>
          <VInputField.Label text={model.amountLotLabel} />
          <VInputField.Input keyboardType={'number-pad'} value={amount.value} {...amount.inputEvents} />
          {!!lotMaxLabel && (
            <VInputField.BottomLeft>
              <VTouchable.Opacity mt={space.md} onPress={amountLotSetMax}>
                <VText style={theme.hint.fText} color={VThemeUtil.colorPick(theme.hint.cText)}>{lotMaxLabel}</VText>
              </VTouchable.Opacity>
            </VInputField.BottomLeft>
          )}
        </VInputField>

        <VInputField error={price.displayErrors} disabled={isTypeMarket}>
          <VInputField.Label text={model.priceLabel} />
          <VInputField.Input keyboardType={'decimal-pad'} value={price.value} {...price.inputEvents} />
        </VInputField>

        {marketCan && (
          <VRow mb={space.lg} alignItems={'center'}>
            <VSwitch value={typeMarket.isChecked} onValueChange={typeMarket.onChange} />
            <VText ml={space.md}>{nameAction} по рыночной цене</VText>
          </VRow>
        )}

        <VSelect.Dropdown mb={space.xl} line reverse title={'Счёт'} placeholder={'Счёт'}
          selected={accountId.value} data={this._accountSelectList} onChange={accountId.onChange} />

        <VRow justifyContent={'space-between'} alignItems={'center'}>
          <VText font={'body5'}>Итого</VText>
          <VText font={'body1'}>{model.cost}</VText>
        </VRow>

        <VCol flex minHeight={space.lg} />
        <VButton.Fill disabled={!model.isValid}
          onPress={onCreate}>{nameAction}</VButton.Fill>
      </VCol>
    );
  }
}
