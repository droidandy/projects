import React from 'react';
import { observer } from 'mobx-react';
import { VButton, VCol, VFormat, VInputField, VRow, VSelect, VSwitch, VText } from '@invest.wl/mobile/src/view/kit';
import { VOrderCreateModel } from '@invest.wl/view/src/Order/model/V.OrderCreate.model';
import { VInstrumentIdentity } from '../../Instrument/component/V.InstrumentIdentity.component';
import { VInstrumentInfoModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentInfo.model';
import { VAccountQUIKModel } from '@invest.wl/view/src/Account/model/V.AccountQUIK.model';
import { computed, makeObservable } from 'mobx';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVSelectDataItem } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';

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
  private get accountSelectList() {
    return this.props.accountModelList.map(a => ({
      value: a.id, name: a.domain.dto.Name,
    } as IVSelectDataItem));
  }

  public render() {
    const { model, instrumentModel, onCreate } = this.props;
    const { typeMarket, marketCan, isTypeMarket, nameAction, fields: { amount, price, accountId } } = model;
    const { space } = this.theme;

    return (
      <VCol flex>
        <VRow alignItems={'center'} justifyContent={'space-between'} mb={space.lg}>
          <VInstrumentIdentity flex mpart={instrumentModel.identity} />
          <VFormat.Number size={'lg'}>{instrumentModel.info.midRate}</VFormat.Number>
        </VRow>

        <VInputField mb={space.lg} error={amount.displayErrors}>
          <VInputField.Label text={model.amountLotLabel} />
          <VInputField.Input keyboardType={'number-pad'}
            value={amount.value} {...amount.inputEvents} />
          <VInputField.HintLeft text={model.amountLotMax} />
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

        <VSelect.Dropdown mb={space.xl} line={true} reverse={true} title={'Счёт'} placeholder={'Счёт'} selected={accountId.value}
          data={this.accountSelectList} onChange={accountId.onChange} />

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
