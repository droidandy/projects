import { EDCustomerGender } from '@invest.wl/core';
import { IVSelectDataItem, VInputField, VSelect } from '@invest.wl/mobile';
import { VCustomerPassportEditModel } from '@invest.wl/view/src/Customer/model/V.CustomerPassportEdit.model';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVCustomerPassportFormProps {
  model: VCustomerPassportEditModel;
}

@observer
export class VCustomerPassportForm extends React.Component<IVCustomerPassportFormProps> {
  @computed
  private get _genderList(): IVSelectDataItem[] {
    return [EDCustomerGender.Female, EDCustomerGender.Male].map(g => ({
      name: g === EDCustomerGender.Female ? 'Женский' : 'Мужской', value: g,
    }));
  }

  public render() {
    const {
      nameFirst, nameLast, nameMiddle, issueDate, issueDepartCode, issueDepartName, serial,
      number, gender,
    } = this.props.model.fields;

    return (
      <>
        <VInputField mt={'lg'} label={'Фамилия'} error={nameLast.displayErrors}>
          <VInputField.Input value={nameLast.value} {...nameLast.inputEvents} />
        </VInputField>

        <VInputField label={'Имя'} error={nameFirst.displayErrors}>
          <VInputField.Input value={nameFirst.value} {...nameFirst.inputEvents} />
        </VInputField>

        <VInputField label={'Отчество'} error={nameMiddle.displayErrors}>
          <VInputField.Input value={nameMiddle.value} {...nameMiddle.inputEvents} />
        </VInputField>

        {/* <VSelect.Date onChange={birthDate.domain.valueSet} selected={birthDate.domain.value}> */}
        {/*  <VInputField label={'Дата рождения'} error={birthDate.displayErrors}> */}
        {/*    <VInputField.Input editable={false} value={birthDate.value} /> */}
        {/*    <VInputField.RightIcon name={'calendar'} /> */}
        {/*  </VInputField> */}
        {/* </VSelect.Date> */}

        {/* <VInputField label={'Место рождения'} error={birthPlace.displayErrors}> */}
        {/*  <VInputField.Input multiline value={birthPlace.value} maxLength={256} {...birthPlace.inputEvents} /> */}
        {/* </VInputField> */}

        <VInputField label={'Серия паспорта РФ'} error={serial.displayErrors}>
          <VInputField.Input keyboardType={'number-pad'}
            value={serial.value} {...serial.inputEvents} />
          <VInputField.Mask mask={serial.maskOptions.mask} />
        </VInputField>

        <VInputField label={'Номер паспорта РФ'} error={number.displayErrors}>
          <VInputField.Input keyboardType={'number-pad'}
            value={number.value} {...number.inputEvents} />
          <VInputField.Mask mask={number.maskOptions.mask} />
        </VInputField>

        <VSelect.Date onChange={issueDate.domain.valueSet} selected={issueDate.domain.value}>
          <VInputField label={'Дата выдачи'} error={issueDate.displayErrors}>
            <VInputField.Input editable={false} value={issueDate.value} />
            <VInputField.RightIcon name={'calendar'} />
          </VInputField>
        </VSelect.Date>

        <VSelect.Dropdown pv={'lg'} title={'Пол'} selected={gender.value} onChange={gender.onChange}
          data={this._genderList} nullableName={'Не определено'} nullable={'Не определено'} />

        <VInputField label={'Кем выдан'} error={issueDepartName.displayErrors}>
          <VInputField.Input multiline value={issueDepartName.value} {...issueDepartName.inputEvents} />
        </VInputField>

        <VInputField label={'Код подразделения'} error={issueDepartCode.displayErrors}>
          <VInputField.Input keyboardType={'number-pad'}
            value={issueDepartCode.value} {...issueDepartCode.inputEvents} />
          <VInputField.Mask mask={issueDepartCode.maskOptions.mask} />
        </VInputField>
      </>
    );
  }
}
