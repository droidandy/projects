import React from 'react';
import PropTypes from 'prop-types';
import NativeModal from 'react-native-modal';

import { ModalAlertStatic } from 'components';

import { withTheme } from 'theme';

import { deviceHeight, deviceWidth } from 'utils';

import { modalStyles as styles } from './styles';

class ModalWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  render() {
    const { theme, onClose, themedStyles, style, children, ...rest } = this.props;

    return (
      <NativeModal
        backdropColor={theme.color.backdrop}
        backdropOpacity={1}
        style={[themedStyles.modal, style]}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        {...rest}
      >
        {children}

        <ModalAlertStatic />
      </NativeModal>
    );
  }
}

export default withTheme(ModalWrapper, styles);
