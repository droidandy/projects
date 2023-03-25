import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback } from 'react-native';

import { DismissKeyboardView, Icon } from 'components';
import { color, withTheme } from 'theme';

import { strings } from 'locales';

import { isIphoneX } from 'utils';

import ModalWrapper from './ModalWrapper';

import { optionsModalStyle as styles } from './styles';

function OptionsModal({ theme, onClose, options, style, closeLabel, themedStyles, ...rest }) {
  const renderOptions = options => (
    <View style={themedStyles.wrapper}>
      {options.map((option, index) => {
        const handler = () => {
          onClose();
          option.onPress();
        };
        return (
          <TouchableWithoutFeedback onPress={handler} key={option.label}>
            <View style={[themedStyles.row, (index + 1) === options.length && themedStyles.rowLast]}>
              {option.icon && <Icon name={option.icon} size={26} color={theme.color.primaryText} />}
              <Text
                style={[
                  themedStyles.label,
                  themedStyles.flex,
                  !option.icon && themedStyles.labelWithoutIcon
                ]}
              >
                {option.label}
              </Text>
              {!option.chevronHide && <Icon name="chevron" width={9} height={13} color={color.arrowRight} />}
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  return (
    <ModalWrapper onClose={onClose} {...rest}>
      <DismissKeyboardView
        style={[themedStyles.container, { height: 96 + (options.length * 56) + (isIphoneX() ? 16 : 0) }]}
      >
        {renderOptions(options)}

        <TouchableWithoutFeedback onPress={onClose}>
          <View style={[themedStyles.wrapper, themedStyles.cancel]}>
            <Text style={themedStyles.label}>{closeLabel}</Text>
          </View>
        </TouchableWithoutFeedback>
      </DismissKeyboardView>
    </ModalWrapper>
  );
}

OptionsModal.propTypes = {
  closeLabel: PropTypes.string,
  onClose: PropTypes.func,
  options: PropTypes.array.isRequired,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  theme: PropTypes.object,
  themedStyles: PropTypes.object
};

OptionsModal.defaultProps = {
  closeLabel: strings('modal.label.close'),
  onClose: () => {}
};

export default withTheme(OptionsModal, styles);
