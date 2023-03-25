import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';

import { sendProfileData, setValidationError } from 'actions/passenger';
import { SaveBtn } from 'components';
import { throttledAction, isInputsValid } from 'utils';

import { validationRules } from '../utils';

function SaveProfileBtn({ touched, navigation, data, sendProfileData, setValidationError, testID }) {
  const handleError = error => setValidationError('temp.validationError', error);

  const handleSendData = () => (
    sendProfileData()
      .then(() => navigation.goBack(null))
      .catch(noop)
  );

  const handleSave = throttledAction(() => {
    if (navigation.state.params) {
      const { key, keys, onSuccess } = navigation.state.params;


      if (touched && isInputsValid(keys || [key], data, validationRules, handleError)) {
        handleSendData()
          .then(() => { if (onSuccess) onSuccess(); });
      }
    } else {
      handleSendData();
    }
  });

  return (
    <SaveBtn onPress={handleSave} enabled={touched} testID={testID} />
  );
}

SaveProfileBtn.propTypes = {
  data: PropTypes.object,
  getCurrentUser: PropTypes.func,
  navigation: PropTypes.object,
  sendProfileData: PropTypes.func,
  setValidationError: PropTypes.func,
  testID: PropTypes.string,
  touched: PropTypes.bool
};

const mapStateToProps = ({ passenger }) => ({
  data: passenger.temp,
  touched: passenger.temp.profileTouched
});

export default connect(mapStateToProps, { sendProfileData, setValidationError })(SaveProfileBtn);
