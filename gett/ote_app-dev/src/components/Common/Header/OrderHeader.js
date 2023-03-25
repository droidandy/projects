import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'components';
import { CUSTOMER_CARE_STATUS, FINAL_STATUSES } from 'utils/orderStatuses';
import { strings } from 'locales';

import { withTheme } from 'theme';

import { BackButton } from './Buttons';

import Header from './Header';

import styles from './style';

const OrderHeader = ({ theme, status, handlePressBack, handlePressCreateNew, backBtnTestID }) => {
  const isCustomerCareStatus = status === CUSTOMER_CARE_STATUS;
  const isFinalStatus = FINAL_STATUSES.includes(status);
  const isRightButtonAvailable = isFinalStatus && !isCustomerCareStatus;

  return (
    <Header
      customStyles={styles.prorderHeader}
      leftButton={<BackButton onClick={handlePressBack} testID={backBtnTestID} />}
      rightButton={isRightButtonAvailable &&
        <Button
          size="sm"
          title={strings('order.button.createNew')}
          type="secondary"
          styleContent={{ backgroundColor: theme.color.bgPrimary }}
          onPress={handlePressCreateNew}
        />
      }
    />
  );
};

OrderHeader.propTypes = {
  backBtnTestID: PropTypes.string,
  handlePressBack: PropTypes.func,
  handlePressCreateNew: PropTypes.func,
  status: PropTypes.string,
  theme: PropTypes.object
};

OrderHeader.defaultProps = {
  handlePressBack: () => {},
  handlePressCreateNew: () => {},
  status: ''
};

export default withTheme(OrderHeader);
