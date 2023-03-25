import React from 'react';
import Form, { Input } from 'components/form';
import { Button, ButtonEdit } from 'components';
import PropTypes from 'prop-types';
import css from './../Billing.css';
import CN from 'classnames';
import { initSecureFields, createToken } from 'utils/paymentsOs';
import { Alert } from 'antd';

export default class BillingForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    onRetryPayment: PropTypes.func
  };

  validations = {
    token: { presence: { message: 'Invalid card details' } },
    holderName: 'presence'
  };

  save = this.save.bind(this);

  cardNumberPlaceholder() {
    const last4 = this.get('last4');
    if (!last4) { return null; }
    return `••••••••••••${last4}`;
  }

  cvvPlaceholder() {
    if (!this.get('last4')) { return null; }
    return '•••';
  }

  componentDidMount() {
    initSecureFields(
      'billing-form-secure-fields',
      this.cardNumberPlaceholder(),
      this.cvvPlaceholder()
    );
  }

  save() {
    createToken(this.get('holderName'), (token) => {
      this.set({ token });
      super.save();
    });
  }

  $render($) {
    return (
      <div className={ CN('white-bg', css.wrapper) }>
        <div className={ CN('layout horizontal center pr-20', css.titleWrapper) }>
          <div className={ CN('flex', css.title) }>Payment details</div>
        </div>
        <div className="p-30">
          <div className="layout vertical">
            <label className="text-12 dark-grey-text bold-text mb-5">Card Details</label>
            <div id="billing-form-secure-fields" className={ css.billingFormSecureFields } />
          </div>
          <Input { ...$('holderName') } className="mb-20" label="Card Holder" labelClassName={ CN('mb-5 text-12', css.formLabel) } />
          { this.getError('token') &&
            <Alert className="mb-10" message={ this.getError('token') } type="error" showIcon />
          }
          <div className="layout horizontal center">
            <ButtonEdit type="primary" onClick={ this.save } >
              { this.get('last4') ? 'Update' : 'Add' } Credit/Debit Card
            </ButtonEdit>
            { !this.get('last4') &&
              <Button type="secondary" className="half-width ml-20" onClick={ this.props.onRetryPayment }>
                Retry Payment
              </Button>
            }
          </div>
          <div className={ CN('text-14 mt-20', css.formText) }>
            All outstanding invoices will be automatically charged to your card after you update it.
          </div>
        </div>
      </div>
    );
  }
}
