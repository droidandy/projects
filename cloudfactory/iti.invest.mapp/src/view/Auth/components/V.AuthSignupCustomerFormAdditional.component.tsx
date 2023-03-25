import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { VButton, VCol, VInputField, VSelect, VText } from '@invest.wl/mobile/src/view/kit';
import { VCustomerPersonalForm } from '../../Customer/component/V.CustomerPersonalForm.component';
import { VCustomerContactForm } from '../../Customer/component/V.CustomerContactForm.component';
import { IVSelectData } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';

@observer
export class VAuthSignupCustomerFormAdditional extends React.Component<IVAuthSignupWithAccountStepProps> {
  constructor(props: IVAuthSignupWithAccountStepProps) {
    super(props);
    makeObservable(this);
  }

  private _birthPlaceList: IVSelectData<string> = [{ name: 'Россия', value: 'RUS' }];

  @computed
  private get _isValid() {
    const { contactModel, personalModel, passportModel } = this.props.present.customerCreatePr;
    const { birthDate, birthPlace } = passportModel.fields;
    const { snils } = personalModel.fields;
    const { email, emailReport } = contactModel.fields;

    return birthDate.isValid && birthPlace.isValid && snils.isValid && email.isValid && emailReport.isValid;
  }

  public render() {
    const {
      passportModel, personalModel, contactModel, cse: { isBusy },
    } = this.props.present.customerCreatePr;
    const { birthDate, birthPlace } = passportModel.fields;

    return (
      <VCol flex>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Основная информация</VText>

        <VSelect.Dropdown title={'Страна'} data={this._birthPlaceList} onChange={birthPlace.onChange}
          selected={birthPlace.value}>
          <VInputField label={'Место рождения'} error={birthPlace.displayErrors}>
            <VInputField.Input editable={false}
              value={this._birthPlaceList.find(p => p.value === birthPlace.value)?.name} />
          </VInputField>
        </VSelect.Dropdown>

        <VSelect.Date onChange={birthDate.domain.valueSet} selected={birthDate.domain.value}>
          <VInputField label={'Дата рождения'} error={birthDate.displayErrors}>
            <VInputField.Input editable={false} value={birthDate.value} />
            <VInputField.RightIcon name={'calendar'} />
          </VInputField>
        </VSelect.Date>

        <VCustomerPersonalForm model={personalModel} innShow={false} />
        <VCustomerContactForm model={contactModel} phoneShow={false} emailReportShow={true} />

        <VCol flex />
        <VButton.Fill mt={'xl'} onPress={this.props.present.stepNext} disabled={!this._isValid || isBusy}>
          Далее
        </VButton.Fill>
      </VCol>
    );
  }
}
