import React from 'react';
import { ModalForm, Input } from 'components/form';
import { round } from 'lodash';
import { centsToPounds } from 'utils';

export default class MarkAsPaidForm extends ModalForm {
  validations = {
    partialPayAmountPounds: [
      'presence',
      { numericality: { greaterThan: 0 } },
      function(partialPayAmountPounds) {
        const partialPayAmountCents = round(partialPayAmountPounds * 100);
        const totalAmountCents = this.get('amountCents');
        const paidAmountCents = this.get('paidAmountCents');

        if ((paidAmountCents + partialPayAmountCents) > totalAmountCents) {
          return "Partial Paid can't be greater than Left to pay amount";
        }
      }
    ]
  };

  onOpen() {
    this.set({
      'partialPayAmountPounds': this.getLeftToPayAmountPounds(),
      'partialPayAmount': this.getLeftToPayAmount()
    });
  }

  changePartialPayAmountPounds(value) {
    this.set({
      'partialPayAmountPounds': value,
      'partialPayAmount': round(parseFloat(value) * 100)
    });
  }

  getLeftToPayAmount() {
    const { amountCents, paidAmountCents } = this.props.attrs;

    return amountCents - paidAmountCents;
  }

  getLeftToPayAmountPounds() {
    return centsToPounds(this.getLeftToPayAmount());
  }

  companyWithPaymentCard = () => {
    return this.props.attrs.companyPaymentType === 'payment_card';
  };

  partialPayDisabled = () => {
    return this.props.attrs.underReview || this.companyWithPaymentCard();
  };

  $render($) {
    const { amountCents, paidAmountCents } = this.props.attrs;

    const totalAmount = centsToPounds(amountCents);
    const paidAmount = centsToPounds(paidAmountCents);

    return (
      <div>
        <label className="bold-text mb-10">
          Amount: £ { totalAmount }
        </label>
        <label className="bold-text mb-10">
          Paid Amount: £ { paidAmount }
        </label>
        <label className="bold-text mb-10">
          Left to pay: £ { this.getLeftToPayAmountPounds() }
        </label>
        <Input
          { ...$('partialPayAmountPounds')(this.changePartialPayAmountPounds) }
          label="Partial pay"
          addonAfter="£"
          labelClassName="bold-text mb-10"
          className="mb-20"
          defaultValue={ this.partialPayDisabled() ? this.getLeftToPayAmountPounds() : null }
          disabled={ this.partialPayDisabled() }
        />
        { this.companyWithPaymentCard() &&
          <p>Company has payment card. You can mark as paid only full amount.</p>
        }
      </div>
    );
  }
}
