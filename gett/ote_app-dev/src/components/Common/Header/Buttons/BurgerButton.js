import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';
import { color, withTheme } from 'theme';
import NavImageButton from 'components/Common/NavImageButton';

import { components } from 'testIDs';

import styles from './styles';

const BurgerButton = ({ theme: { type }, themedStyles, onClick }) => (
  <NavImageButton
    onClick={onClick}
    styleContainer={{ justifyContent: 'center' }}
    styleView={themedStyles.touchZone}
    icon={<Icon size={24} name="burger" color={type === 'light' ? color.primaryText : color.white} />}
    testID={components.BurgerButton}
  />
);

BurgerButton.propTypes = {
  onClick: PropTypes.func,
  theme: PropTypes.object.isRequired,
  themedStyles: PropTypes.object
};

BurgerButton.defaultProps = {
  onClick: () => {}
};

export default withTheme(BurgerButton, styles);
