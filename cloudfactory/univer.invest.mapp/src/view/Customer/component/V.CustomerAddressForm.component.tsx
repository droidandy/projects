import React from 'react';
import { observer } from 'mobx-react';
import { IVCustomerAddressEditModel } from '@invest.wl/view/src/Customer/model/V.CustomerAddressEdit.model';
import { VAddressSearch } from '../../Address/component/V.AddressSearch.component';
import { VCheckBox, VCol, VInputField, VText } from '@invest.wl/mobile/src/view/kit';

export interface IVCustomerAddressFormProps {
  model: IVCustomerAddressEditModel;
  postalNeed?: boolean;
}

@observer
export class VCustomerAddressForm extends React.Component<IVCustomerAddressFormProps> {
  public render() {
    const { fields: { Actual, Register, Postal, Birth }, isActualSame, isPostalSame } = this.props.model;

    return (
      <>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Адрес регистрации</VText>
        <VAddressSearch initialValue={Register.fields.full.value ?? ''}
          onSelect={Register.domain.fromDTO} onInput={Register.fields.full.onChangeText}>
          <VInputField mt={'lg'} error={Register.fields.full.displayErrors}>
            <VInputField.Input placeholder={'Адрес регистрации'} editable={false} multiline
              value={Register.fields.full.value} {...Register.fields.full.inputEvents} />
          </VInputField>
        </VAddressSearch>

        {!isActualSame.domain.value && (
          <VCol mt={'lg'}>
            <VText mb={'lg'} ta={'center'} font={'body7'}>Адрес места жительства</VText>
            <VAddressSearch initialValue={Actual.fields.full.value ?? ''}
              onSelect={Actual.domain.fromDTO} onInput={Actual.fields.full.onChangeText}
              title={'Адрес фактического проживания'}>
              <VInputField error={Actual.fields.full.displayErrors}>
                <VInputField.Input placeholder={'Адрес фактического проживания'} editable={false} multiline
                  value={Actual.fields.full.value} {...Actual.fields.full.inputEvents} />
              </VInputField>
            </VAddressSearch>
          </VCol>
        )}

        {!!this.props.postalNeed && !isPostalSame.domain.value && (
          <VCol mt={'lg'}>
            <VText mb={'lg'} ta={'center'} font={'body7'}>Адрес корреспонденции</VText>
            <VAddressSearch initialValue={Postal.fields.full.value ?? ''}
              onSelect={Postal.domain.fromDTO} onInput={Postal.fields.full.onChangeText}
              title={'Адрес для корреспонденции'}>
              <VInputField error={Postal.fields.full.displayErrors}>
                <VInputField.Input placeholder={'Адрес для корреспонденции'} editable={false} multiline
                  value={Postal.fields.full.value} {...Postal.fields.full.inputEvents} />
              </VInputField>
            </VAddressSearch>
          </VCol>
        )}

        <VCol mt={'lg'}>
          <VText mb={'lg'} ta={'center'} font={'body7'}>Адрес места рождения</VText>
          <VAddressSearch initialValue={Birth.fields.full.value ?? ''}
            onSelect={Birth.domain.fromDTO} onInput={Birth.fields.full.onChangeText}
            title={'Адрес места рождения'}>
            <VInputField error={Birth.fields.full.displayErrors}>
              <VInputField.Input placeholder={'Адрес места рождения'} editable={false} multiline
                value={Birth.fields.full.value} {...Birth.fields.full.inputEvents} />
            </VInputField>
          </VAddressSearch>
        </VCol>

        <VCheckBox mt={'lg'}
          text={'Адрес места жительства совпадает с адресом регистрации'}
          isChecked={isActualSame.domain.value} onPress={isActualSame.onChange} />

        {this.props.postalNeed && (
          <VCheckBox mt={'lg'}
            text={'Адрес для корреспонденции совпадает с адресом регистрации'}
            isChecked={isPostalSame.domain.value} onPress={isPostalSame.onChange} />
        )}
      </>
    );
  }
}
