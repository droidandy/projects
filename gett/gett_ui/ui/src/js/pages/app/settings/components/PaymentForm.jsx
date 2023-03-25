import React from 'react';
import { ModalForm, Input } from 'components/form';
import moment from 'moment';
import { isEmpty, minBy, sumBy } from 'lodash';
import { initSecureFields, createToken } from 'utils/paymentsOs';
import { Alert } from 'antd';

import { gettAccountNo, gettSortCode } from './data';

export default class PaymentForm extends ModalForm {
  validations = {
    'paymentCard.holderName': 'presence',
    'paymentCard.token': { presence: { message: 'Invalid card details' } }
  };

  getDueBy() {
    const { invoices } = this.props.attrs;
    if (isEmpty(invoices)) { return null; }
    const minOverdueAt = minBy(invoices, 'overdueAt').overdueAt;
    return moment(minOverdueAt).format('DD MMM \'YY');
  }

  getTotalDue() {
    const { invoices } = this.props.attrs;
    if (isEmpty(invoices)) { return null; }

    const totalDueCents = sumBy(invoices, 'amountCents');
    const paidDueCents = sumBy(invoices, 'paidAmountCents');

    const restDueCents = totalDueCents - paidDueCents;

    return (restDueCents / 100).toLocaleString('en-UK');
  }

  onOpen() {
    initSecureFields('card-secure-fields');
  }

  save() {
    createToken(this.get('paymentCard.holderName'), (token) => {
      this.set({ 'paymentCard.token': token });
      super.save();
    });
  }

  $render($) {
    return (
      <div>
        <div className="sand-bg p-20 mb-20">
          <div className="layout horizontal center pb-10 border-bottom text-bold">
            <div className="flex">Bank Info</div>
            <div className="flex text-center">Due By</div>
            <div className="flex text-center">Total Due</div>
          </div>
          <div className="layout horizontal center pt-10">
            <div className="flex">
              <div>Account No: <span className="bold-text">{ gettAccountNo }</span></div>
              <div>Sort Code: <span className="bold-text">{ gettSortCode }</span></div>
            </div>
            <div className="flex text-20 text-center">{ this.getDueBy() }</div>
            <div className="flex red-text text-20 text-center" data-name="totalDue">£{ this.getTotalDue() }</div>
          </div>
        </div>
        <div className="layout vertical">
          <label className="text-12 dark-grey-text bold-text mb-5">Card Details</label>
          <div id="card-secure-fields" />
        </div>
        <div className="layout horizontal mb-20">
          <Input { ...$('paymentCard.holderName') } className="flex" label="Card Holder" labelClassName="mb-5" />
        </div>
        { this.getError('paymentCard.token') &&
          <Alert message={ this.getError('paymentCard.token') } type="error" showIcon />
        }
      </div>
    );
  }
}
