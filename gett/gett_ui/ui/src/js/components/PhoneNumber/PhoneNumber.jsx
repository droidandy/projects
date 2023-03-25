import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from 'utils';

export default function PhoneNumber({ phone, emptyText = '-', ...rest }) {
  return (
    <div { ...rest }>{ phone ? formatPhoneNumber(phone) : emptyText }</div>
  );
}

PhoneNumber.propTypes = {
  phone: PropTypes.string,
  emptyText: PropTypes.string
};
