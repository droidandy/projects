import React from 'react';
import NumberFormat from 'react-number-format';

const InvoiceAmount = ({ invoice }) => {
  const { amount, amount_refunded, refunded } = invoice;
  if (refunded) {
    return amount === amount_refunded ? (
      <NumberFormat
        value={Math.round(amount)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
      />
    ) : (
      <>
        <NumberFormat
          value={Math.round(amount)}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'$'}
        />
        (
        <NumberFormat
          value={Math.round(amount_refunded)}
          displayType={'text'}
          thousandSeparator={true}
          prefix={'-$'}
        />
        )
      </>
    );
  } else {
    return (
      <NumberFormat
        value={Math.round(amount)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
      />
    );
  }
};

export default InvoiceAmount;
