import React from 'react';
import { observer } from 'mobx-react';
import { VButton, VCol, VInputField, VSelect } from '@invest.wl/mobile/src/view/kit';
import { computed, makeObservable } from 'mobx';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { IVSelectData } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';
import { VOperationDepositCreateModel } from '@invest.wl/view/src/Operation/model/V.OperationDepositCreate.model';
import { VAccountByAgreementModel } from '@invest.wl/view/src/Account/model/V.AccountByAgreement.model';
import { IDAccountItem } from '@invest.wl/domain/src/Account/model/D.AccountByAgreement.model';
import { TDCurrencyCode, TModelId } from '@invest.wl/core';
import { Formatter } from '@invest.wl/common/src/util/formatter.util';

export interface IVOperationDepositProps<I extends IDAccountItem> {
  model: VOperationDepositCreateModel;
  agreementList: VAccountByAgreementModel<I>[];
  currencyList: IVSelectData<TDCurrencyCode>;
  onCancel(): void;
  onSubmit(): void;
}

@observer
export class VOperationDepositForm<I extends IDAccountItem> extends React.Component<IVOperationDepositProps<I>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  private get agreementSelectList(): IVSelectData<TModelId> {
    // TODO: must be not name. refact after add DInputObjectModel (value === AgreementItemDTO)
    return this.props.agreementList.map(a => ({ value: a.name, name: a.name }));
  }

  @computed
  private get accountSelectList(): IVSelectData<TModelId> {
    // TODO: must be not name. refact after add DInputObjectModel (value === AccountItemDTO)
    const agreementValue = this.props.model.fields.agreement.value;
    const agreement = agreementValue ? this.props.agreementList.find(a => a.name === agreementValue) : undefined;
    const accountList = agreement?.accountListX.list || [];
    return accountList.map(a => ({ value: a.domain.dto.Name, name: a.domain.dto.Name }));
  }

  @computed
  private get amountList(): IVSelectData<number> {
    const currency = this.props.model.fields.currency.value;
    return currency ? [1000, 5000, 10000, 50000, 100000].map(a => ({
      value: a,
      name: Formatter.currency(a, { code: currency }),
    })) : [];
  }

  constructor(props: IVOperationDepositProps<I>) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model, onSubmit, onCancel } = this.props;
    const { fields: { agreement, account, currency, total } } = model;
    const { space, color } = this.theme;

    return (
      <VCol flex>
        <VSelect.Dropdown mb={space.xl} title={'Договор'} placeholder={'Договор'} selected={agreement.value}
          data={this.agreementSelectList} onChange={this._onAgreementChange} />

        <VSelect.Dropdown mb={space.xl} title={'Торговый код'} placeholder={'Торговый код'} selected={account.value}
          data={this.accountSelectList} onChange={account.onChange} />

        <VSelect.Dropdown mb={space.xl} title={'Валюта'} placeholder={'Валюта'} selected={currency.value}
          data={this.props.currencyList} onChange={currency.onChange} />

        <VInputField mb={space.lg}>
          <VInputField.Label text={'Сумма'} />
          <VInputField.Input keyboardType={'decimal-pad'} value={total.value} {...total.inputEvents} />
          <VInputField.RightButton>{model.currencySymbol}</VInputField.RightButton>
        </VInputField>

        <VSelect.Button mb={space.lg} data={this.amountList} scrollable onChange={total.onChange} />

        <VCol flex minHeight={space.lg} />
        <VButton.Stroke color={color.accent1} onPress={onCancel}>{'Отменить'}</VButton.Stroke>
        <VButton.Fill color={color.accent1} mt={'lg'} disabled={!model.isValid} onPress={onSubmit}>{'Оплатить'}</VButton.Fill>
      </VCol>
    );
  }

  private _onAgreementChange = (v: string) => {
    const { agreement, account } = this.props.model.fields;
    agreement.onChange(v);
    account.onChange(undefined);
  };
}
