import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';

import { sendAddress, setValidationError, setTempAddress } from 'actions/passenger';
import { SaveBtn } from 'components';
import { throttledAction, isInputsValid } from 'utils';

import { addressValidationRules } from '../utils';

const SaveAddressBtn = ({ touched, navigation, data, sendAddress, setValidationError, testID, setTempAddress }) => {
  const isValid = () => isInputsValid(
    Object.keys(addressValidationRules),
    data,
    addressValidationRules,
    errors => setValidationError('temp.addressErrors', errors)
  );

  const handleSave = throttledAction(() => {
    if (touched && isValid()) {
      sendAddress()
        .then(() => {
          navigation.goBack(null);
          setTempAddress({});
        })
        .catch(noop);
    }
  });

  return (
    <SaveBtn onPress={handleSave} enabled={touched} testID={testID} />
  );
};

SaveAddressBtn.propTypes = {
  data: PropTypes.object,
  navigation: PropTypes.object,
  sendAddress: PropTypes.func,
  setTempAddress: PropTypes.func,
  setValidationError: PropTypes.func,
  testID: PropTypes.string,
  touched: PropTypes.bool
};

const mapStateToProps = ({ passenger }) => ({
  data: passenger.temp.address,
  touched: passenger.temp.addressTouched
});

export default connect(mapStateToProps, { sendAddress, setValidationError, setTempAddress })(SaveAddressBtn);
