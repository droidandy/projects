import React from 'react';
import { observer } from 'mobx-react';
import { VCustomerContactEditModel } from '@invest.wl/view/src/Customer/model/V.CustomerContactEdit.model';
import { VCheckBox, VInputField } from '@invest.wl/mobile/src/view/kit';

export interface IVCustomerContactFormProps {
  model: VCustomerContactEditModel;
  // TODO: refact this
  phoneShow?: boolean;
  emailShow?: boolean;
  emailReportShow?: boolean;
}

@observer
export class VCustomerContactForm extends React.Component<IVCustomerContactFormProps> {
  public static defaultProps = {
    phoneShow: true,
    emailShow: true,
    emailReportShow: false,
  };

  public render() {
    const { phoneShow, emailShow, emailReportShow, model } = this.props;
    const { isEmailReportSame, fields: { email, phone, emailReport } } = model;

    return (
      <>
        {phoneShow && (
          <VInputField label={'Мобильный телефон'} error={phone.displayErrors}>
            <VInputField.Input value={phone.value} {...phone.inputEvents} />
            <VInputField.Mask mask={phone.maskOptions.mask} />
          </VInputField>
        )}

        {emailShow && (
          <VInputField mt={phoneShow ? 'lg' : undefined} label={'E-mail для связи'}
            error={email.displayErrors}>
            <VInputField.Input value={email.value} {...email.inputEvents} />
          </VInputField>
        )}

        {emailReportShow && (
          <>
            {!isEmailReportSame.domain.value && (
              <VInputField label={'E-mail для отчетов'}
                error={emailReport.displayErrors}>
                <VInputField.Input value={emailReport.value} {...emailReport.inputEvents} />
              </VInputField>
            )}

            <VCheckBox onPress={isEmailReportSame.onChange} isChecked={isEmailReportSame.domain.value}
              text={'E-main для отчетов совпадает с E-mail для связи'} />
          </>
        )}
      </>
    );
  }
}
