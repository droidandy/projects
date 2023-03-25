import React from 'react';
import { ModalForm, Select, Input } from 'components/form';
import { Alert } from 'antd';
import { initSecureFields, createToken } from 'utils/paymentsOs';

import { includes } from 'lodash';

const { Option } = Select;

export default class PaymentCardForm extends ModalForm {
  validations = {
    holderName: 'presence',
    token: { presence: { message: 'Invalid card details' } }
  };

  changeKind(value) {
    this.set({
      kind: value,
      personal: value === 'personal'
    });
  }

  onOpen() {
    initSecureFields('card-secure-fields');
  }

  save() {
    createToken(this.get('holderName'), (token) => {
      this.set({ token });
      super.save();
    });
  }

  $render($) {
    const { companyPaymentTypes } = this.props;
    const onlyBusinessCardsAllowed = includes(companyPaymentTypes, 'passenger_payment_card_periodic');

    return (
      <div id={ this.componentName }>
        <div className="layout horizontal end mb-20">
          <Select
            { ...$('kind')(this.changeKind) }
            className="flex"
            label="Card Type"
            labelClassName="mb-5"
            containerId={ this.componentName }
          >
            { !onlyBusinessCardsAllowed &&
              <Option value="personal">Personal</Option>
            }
            <Option value="business">Business</Option>
          </Select>
        </div>
        <div className="layout vertical">
          <label className="text-12 dark-grey-text bold-text mb-5">Card Details</label>
          <div id="card-secure-fields" className="layout horizontal end" />
        </div>
        <div className="layout horizontal mb-20">
          <Input { ...$('holderName') } className="flex" label="Card Holder" labelClassName="mb-5" />
        </div>
        { this.getError('token') &&
          <Alert message={ this.getError('token') } type="error" showIcon />
        }
      </div>
    );
  }
}
