import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { rateDriver } from 'actions/booking';
import { SaveBtn } from 'components';
import { throttledAction } from 'utils';
import { strings } from 'locales';

function SaveRatingBtn({ rating, rateDriver, navigation, rateable = true }) {
  if (!rateable) return null;

  const handleSave = throttledAction(() => {
    if (rating) {
      rateDriver()
        .then(() => navigation.goBack(null));
    }
  });

  return (
    <SaveBtn
      title={strings('header.button.send')}
      onPress={handleSave}
      enabled={!!rating}
    />
  );
}

SaveRatingBtn.propTypes = {
  navigation: PropTypes.object,
  rateable: PropTypes.bool,
  rateDriver: PropTypes.func,
  rating: PropTypes.number
};

SaveRatingBtn.defaultProps = {
  rateable: true
};

const mapStateToProps = ({ booking }) => ({
  rateable: booking.currentOrder.rateable,
  rating: booking.currentOrder.tempDriverRating
});

export default connect(mapStateToProps, { rateDriver })(SaveRatingBtn);
