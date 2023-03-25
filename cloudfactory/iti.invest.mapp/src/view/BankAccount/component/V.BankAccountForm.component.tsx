import React from 'react';
import { observer } from 'mobx-react';

import { action, computed, makeObservable, observable } from 'mobx';
import { NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native';
import { IVFlexProps, VCheckBox, VCol, VInputField, VSelect } from '@invest.wl/mobile/src/view/kit';
import { VBankSearch } from './V.BankSearch.component';
import { IVBankModel } from '@invest.wl/view/src/BankAccount/model/V.Bank.model';
import { IVSelectData } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';
import { EDCurrencyCode } from '@invest.wl/core';
import { VBankAccountEditModel } from '@invest.wl/view/src/BankAccount/model/V.BankAccountEdit.model';

interface IVBankAccountFormProps extends IVFlexProps {
  model: VBankAccountEditModel;
  currencyList: EDCurrencyCode[];
}

@observer
export class VBankAccountForm extends React.Component<IVBankAccountFormProps> {
  @observable private numbersOfLine = 1;
  @observable private initHeight?: number;

  @computed
  public get currencySelectList(): IVSelectData<EDCurrencyCode> {
    return this.props.currencyList.map(c => ({ name: c, value: c }));
  }

  constructor(props: IVBankAccountFormProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model, currencyList, ...props } = this.props;
    const {
      bank: { inn, kpp, bik, name, accountCorr },
      accountCurrent, accountPersonal, currency,
    } = model.fields;
    const isRequired = model.isRequired;

    return (
      <VCol {...props}>
        <VCheckBox mb={'lg'} isChecked={isRequired.isChecked} onPress={isRequired.onChange}
          text={'Заполнить'} />

        {/* <VInputField label={'Получатель'} error={recipient.displayErrors}> */}
        {/*   <VInputField.Input value={recipient.value} {...recipient.inputEvents} /> */}
        {/* </VInputField> */}

        <VSelect.Dropdown pb={'lg'} title={'Валюта'} placeholder={'Валюта'} selected={currency.Name.value}
          data={this.currencySelectList} onChange={currency.Name.onChange} disabled={currency.Name.isDisabled} />

        <VBankSearch initialValue={bik.value || ''} onSelect={this._onSelectBik} disabled={bik.isDisabled}>
          <VInputField label={'Бик банка'} error={bik.displayErrors}>
            <VInputField.Input editable={false} value={bik.value} {...bik.inputEvents} />
          </VInputField>
        </VBankSearch>

        <VInputField label={'ИНН'} error={inn.displayErrors} disabled={inn.isDisabled}>
          <VInputField.Input multiline value={inn.value} {...inn.inputEvents} />
          <VInputField.Mask mask={inn.maskOptions.mask} />
        </VInputField>

        <VInputField label={'КПП'} error={kpp.displayErrors} disabled={kpp.isDisabled}>
          <VInputField.Input value={kpp.value} {...kpp.inputEvents} />
          <VInputField.Mask mask={kpp.maskOptions.mask} />
        </VInputField>

        <VInputField label={'Название банка'} error={name.displayErrors} disabled={name.isDisabled}>
          <VInputField.Input multiline value={name.value} {...name.inputEvents} />
        </VInputField>

        {/* <VInputField label={'Город банка'} error={city.displayErrors} disabled> */}
        {/*   <VInputField.Input multiline value={city.value} {...city.inputEvents} /> */}
        {/* </VInputField> */}

        <VInputField label={'Корреспондентский счет'} error={accountCorr.displayErrors}
          disabled={accountCorr.isDisabled}>
          <VInputField.Input multiline value={accountCorr.value} {...accountCorr.inputEvents} />
          <VInputField.Mask mask={accountCorr.maskOptions.mask} />
        </VInputField>

        <VInputField label={'Расчётный счёт'} error={accountCurrent.displayErrors} disabled={accountCurrent.isDisabled}>
          <VInputField.Input keyboardType={'number-pad'} multiline
            value={accountCurrent.value} {...accountCurrent.inputEvents} />
          <VInputField.Mask mask={accountCurrent.maskOptions.mask} />
        </VInputField>

        <VInputField label={'Лицевой счёт'} error={accountPersonal.displayErrors} disabled={accountPersonal.isDisabled}>
          <VInputField.Input keyboardType={'number-pad'} multiline
            numberOfLines={this.numbersOfLine} onContentSizeChange={this.changeNumberOfLines}
            maxLength={30} value={accountPersonal.value} {...accountPersonal.inputEvents} />
        </VInputField>
      </VCol>
    );
  }

  @action.bound
  private changeNumberOfLines(event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) {
    const height = event.nativeEvent.contentSize.height;
    if (!this.initHeight) this.initHeight = height;
    this.numbersOfLine = height >= this.initHeight ? 2 : 1;
  };

  private _onSelectBik = (model: IVBankModel) => {
    const { accountCurrent, currency, accountPersonal } = this.props.model.fields;
    this.props.model.domain.fromDTO({
      accountCurrent: accountCurrent.value!, accountPersonal: accountPersonal.value,
      bank: model, currency: { Name: currency.Name.value! },
    });
  };
}
