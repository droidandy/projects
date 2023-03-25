import React, { PropTypes } from 'react';
import { Input } from 'react-onsenui';

const InputField = ({ css, input, label, type, meta: { touched, error } }) => (
  <div>
    <Input
      className={css}
      modifier='material'
      {...input}
      type={type}
      placeholder={label}
    />
    {touched && ((error &&
      <span
        style={{
          fontSize: '14px',
          display: 'block',
          color: '#9e1c26',
          margin: '10px'
        }}
      >
        {error}
      </span>
    ))}
  </div>
);

InputField.propTypes = {
  css: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.string
};

export default InputField;
