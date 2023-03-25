import { centsToPounds } from 'utils';

export const invoiceTypeLabels = {
  'invoice': 'Invoice',
  'cc_invoice': 'CC Invoice',
  'credit_note': 'Credit Note'
};

export const directDebitStatusLabels = {
  'active': 'Direct Debit is set up.',
  'failed': 'Direct Debit could not be set up.',
  'cancelled': 'Direct Debit is cancelled.',
  'pending': 'Direct Debit is currently being set up.'
};

export const paymentMethodLabels = {
  'payment_card': 'Credit/Debit Card',
  'direct_debit': 'Direct Debit'
};

export const paymentMethodIcons = {
  'payment_card': 'PaymentCardIcon',
  'direct_debit': 'DirectDebitIcon'
};

export function renderInvoiceAmountField(record) {
  const paidAmount = centsToPounds(record.paidAmountCents);
  const totalAmount = centsToPounds(record.amountCents);

  if (paidAmount == 0 || paidAmount == totalAmount) {
    return `£ ${totalAmount}`;
  } else {
    return `£ ${paidAmount}/${totalAmount}`;
  }
}
