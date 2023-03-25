import React from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';
const ValidationLabel = (props) => (
  <Label
    className="customFormValidation"
    pointing={props.pointing || false}
    style={{ color: '#fff', fontWeight: 'normal', background: '#f78b61', display: props.show ? (props.pointing ? 'inline-block' : 'block') : 'none', margin: props.pointing ? null : '10px 0' }}// eslint-disable-line no-nested-ternary
  >
    <Icon name="warning" />
    {(props.error && props.error.msg) || 'Please enter a value'}
  </Label>
);

ValidationLabel.propTypes = {
  pointing: PropTypes.string,
  error: PropTypes.object,
  show: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  msg: PropTypes.string,
};
export default ValidationLabel;
