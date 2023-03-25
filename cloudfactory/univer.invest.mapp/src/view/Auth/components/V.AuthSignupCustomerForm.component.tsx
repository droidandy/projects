import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { VButton, VCheckBox, VCol, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core';
import { IVThemeStore, VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { Linking } from 'react-native';
import { VCustomerPersonalForm } from '../../Customer/component/V.CustomerPersonalForm.component';
import { VCustomerPassportForm } from '../../Customer/component/V.CustomerPassportForm.component';
import { VCustomerContactForm } from '../../Customer/component/V.CustomerContactForm.component';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';

@observer
export class VAuthSignupCustomerForm extends React.Component<IVAuthSignupWithAccountStepProps> {
  private _theme = IoC.get<IVThemeStore>(VThemeStoreTid);
  private _cfg = IoC.get<ISConfigStore>(SConfigStoreTid);

  constructor(props: IVAuthSignupWithAccountStepProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _isValid() {
    const { contactModel, personalModel, passportModel } = this.props.present.customerCreatePr;
    return passportModel.isValid && personalModel.fields.inn.isValid && contactModel.fields.phone.isValid;
  }

  public render() {
    const { color } = this._theme;
    const {
      passportModel, personalModel, contactModel, personalDataHandleAgree, cse: { isBusy },
    } = this.props.present.customerCreatePr;

    return (
      <VCol flex>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Контактная информация</VText>

        <VCustomerPassportForm model={passportModel} />
        <VCustomerPersonalForm model={personalModel} snilsShow={false} />
        <VCustomerContactForm model={contactModel} emailShow={false} emailReportShow={false} />

        <VCol flex />
        <VCheckBox mt={'lg'} isChecked={personalDataHandleAgree.domain.value}
          onPress={personalDataHandleAgree.onChange}>
          <VCheckBox.Text>
            <VTouchable.Opacity onPress={this._openPersonalDataAgreement}>
              <VText ml={'md'} font={'body12'}>
                Я подтверждаю свое согласие <VText color={color.accent1}>на обработку персональных данных</VText>
              </VText>
            </VTouchable.Opacity>
          </VCheckBox.Text>
        </VCheckBox>

        <VText mt={'lg'} pl={28}>Ознакомиться с информацией по защите информации можно по <VText
          onPress={this._openDataProtect} color={color.accent1}>ссылке</VText></VText>

        <VButton.Fill mt={'xl'} onPress={this._next} disabled={!this._isValid || isBusy}>
          Далее
        </VButton.Fill>
      </VCol>
    );
  }

  private _openPersonalDataAgreement = () => Linking.openURL(this._cfg.ownerAgreementPersonalDataLink || '');
  private _openDataProtect = () => Linking.openURL(this._cfg.ownerDataProtectLink || '');
  private _next = async () => {
    const { stepNext, customerCreatePr } = this.props.present;
    await customerCreatePr.cse.create();
    stepNext();
  };
}
