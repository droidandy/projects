import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavImageButton from 'components/Common/NavImageButton';
import { changeSwipedPaymentCard } from 'actions/passenger';
import { Icon } from 'components';
import { throttledAction } from 'utils';

import { containers } from 'testIDs';

const IDs = containers.PaymentCards;

const AddPaymentBtn = ({ navigation, changeSwipedPaymentCard }) => {
  const theme = navigation.state.params.theme;
  const onAddPaymentCard = throttledAction(() => {
    changeSwipedPaymentCard(null);
    navigation.navigate(
      'PaymentCardEditor',
      {
        keys: ['cardNumber', 'cvv', 'holderName', 'expirationMonth', 'expirationYear', 'expirationDate'],
        theme
      }
    );
  });

  return (
    <NavImageButton
      onClick={onAddPaymentCard}
      styleView={{ marginRight: 10 }}
      icon={<Icon size={24} name="plus" color={theme.color.primaryText}
      testID={IDs.addButton} />}
    />
  );
};

AddPaymentBtn.propTypes = {
  changeSwipedPaymentCard: PropTypes.func,
  navigation: PropTypes.object,
  testID: PropTypes.string
};

export default connect(null, { changeSwipedPaymentCard })(AddPaymentBtn);
