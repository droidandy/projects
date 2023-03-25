import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';

import { DismissKeyboardView } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { iPhoneHeaderPadding, isAndroid, deviceHeight } from 'utils';

import ModalWrapper from './ModalWrapper';

import { modalStyles as styles } from './styles';

function Modal({
  onClose, label, title, titleStyles, contentStyles, children, type,
  headerContent, leftButton, closeTextStyle, testID, themedStyles, gesturesEnabled, ...rest
}) {
  let heightStyle = isAndroid ? { flex: 1 } : { height: deviceHeight - iPhoneHeaderPadding };
  heightStyle = type === 'fullScreen' ? heightStyle : null;

  const modalProps = gesturesEnabled
    ? { ...rest, onSwipe: onClose, swipeDirection: 'down', swipeThreshold: 80, scrollOffsetMax: 100 }
    : { ...rest };

  const renderRoundedRectangle = () => (
    <View style={themedStyles.containerSwipe}>
      <View style={themedStyles.roundedRectangle} />
    </View>
  );

  return (
    <ModalWrapper {...modalProps}>
      <DismissKeyboardView style={[themedStyles.container, contentStyles, heightStyle]}>
        <View style={themedStyles.header} testID={testID}>
          {headerContent
            ? headerContent()
            : (
              <Fragment>
                {leftButton || null}
                <Text style={[themedStyles.defaultText, titleStyles]}>{title}</Text>
                <TouchableOpacity onPress={onClose} testID={`${testID}/close`}>
                  <Text style={[themedStyles.closeText, closeTextStyle || {}]}>{label}</Text>
                </TouchableOpacity>
              </Fragment>
            )
          }
        </View>
        {children}
        {gesturesEnabled && renderRoundedRectangle()}
      </DismissKeyboardView>
    </ModalWrapper>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  closeTextStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  contentStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  gesturesEnabled: PropTypes.bool,
  headerContent: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  label: PropTypes.string,
  leftButton: PropTypes.node,
  onClose: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  testID: PropTypes.string,
  themedStyles: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  titleStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  type: PropTypes.oneOf(['dynamicHeight', 'fullScreen'])
};

Modal.defaultProps = {
  gesturesEnabled: false,
  label: strings('modal.label.close'),
  title: '',
  type: 'dynamicHeight'
};

export default withTheme(Modal, styles);
