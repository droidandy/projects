import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Badge, Button } from 'components';
import { strings } from 'locales';
import { withTheme } from 'theme';

import { containers } from 'testIDs';

import { BurgerButton, BackButton } from './Buttons';

import Header from './Header';

import styles from './style';

const IDs = containers.Orders;

const OrderCreatingHeader = ({
  unreadNotifications, handlePressBurger, handlePressBack, handlePressOrder, type, style, theme, backBtnTestID }) => (
  <Header
    customStyles={[styles.prorderHeader, style]}
    leftButton={type === 'dashboard'
      ? (
        <Fragment>
          <BurgerButton onClick={handlePressBurger} />
          {!!unreadNotifications &&
            <Badge style={styles.badge} value={unreadNotifications} />
          }
        </Fragment>
      )
      : <BackButton onClick={handlePressBack} testID={backBtnTestID} />
    }
    rightButton={type === 'dashboard' &&
      <Button
        size="sm"
        type="secondary"
        styleContent={{ backgroundColor: theme.color.bgPrimary }}
        onPress={handlePressOrder}
        title={strings('order.button.orders')}
        testID={IDs.mainButton}
      />
    }
  />
);

OrderCreatingHeader.propTypes = {
  backBtnTestID: PropTypes.string,
  handlePressBack: PropTypes.func,
  handlePressBurger: PropTypes.func,
  handlePressOrder: PropTypes.func,
  nightMode: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  theme: PropTypes.object,
  type: PropTypes.oneOf(['dashboard', 'orderCreating']),
  unreadNotifications: PropTypes.number
};

OrderCreatingHeader.defaultProps = {
  handlePressBack: () => {},
  handlePressBurger: () => {},
  handlePressOrder: () => {},
  nightMode: false,
  type: 'dashboard'
};

export default withTheme(OrderCreatingHeader);
