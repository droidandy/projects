import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addPaymentCard, setValidationError } from 'actions/passenger';
import { SaveBtn } from 'components';
import { throttledAction, showMessageAlert, isInputsValid } from 'utils';
import { strings } from 'locales';
import { validationRules } from './utils';

const SavePaymentBtn = ({ touched, navigation, data, addPaymentCard, setValidationError, testID }) => {
  const handleSave = throttledAction(() => {
    const { keys, theme } = navigation.state.params;

    if (touched &&
      isInputsValid(keys, data, validationRules, error => setValidationError('validationPaymentError', error))
    ) {
      addPaymentCard()
        .then(() => navigation.goBack(null))
        .catch(() => {
          showMessageAlert({ theme, message: strings('alert.message.enterValidCreditCard') });
        });
    }
  });

  return <SaveBtn onPress={handleSave} enabled={touched} testID={testID}/>;
};

SavePaymentBtn.propTypes = {
  addPaymentCard: PropTypes.func,
  data: PropTypes.object,
  navigation: PropTypes.object,
  setValidationError: PropTypes.func,
  testID: PropTypes.string,
  touched: PropTypes.bool
};

const mapStateToProps = ({ passenger }) => ({
  data: passenger.newPaymentData,
  touched: passenger.touched
});

export default connect(mapStateToProps, { addPaymentCard, setValidationError })(SavePaymentBtn);
