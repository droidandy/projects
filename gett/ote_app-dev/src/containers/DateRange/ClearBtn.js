import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SaveBtn } from 'components';

import { strings } from 'locales';
import { throttledAction } from 'utils';

const ClearBtn = ({ orders: { tempMeta }, onClearPress }) => {
  const handleClear = throttledAction(() => {
    onClearPress();
  });

  return (
    <SaveBtn
      title={strings('header.button.clear')}
      onPress={handleClear}
      enabled={tempMeta.rangeValue.length > 0}
      style={{ paddingRight: 0 }}
    />
  );
};

ClearBtn.propTypes = {
  onClearPress: PropTypes.func,
  orders: PropTypes.object
};

const mapStateToProps = ({ orders }) => ({
  orders
});

export default connect(mapStateToProps)(ClearBtn);
