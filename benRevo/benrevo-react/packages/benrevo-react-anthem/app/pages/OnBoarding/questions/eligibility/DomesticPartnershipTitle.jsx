import React from 'react';
import PropTypes from 'prop-types';
export default function HoursPerWeekTitle(props) {
  return (
    <div>
      Domestic Partnership Coverage. <a onClick={() => { props.getFile('Domestic Partner Comparison Chart') }}>Domestic Partner Comparison Chart</a>
    </div>
  );
}
