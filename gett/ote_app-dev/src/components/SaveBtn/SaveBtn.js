import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { touchableArea } from 'utils';

function SaveBtn({ onPress, enabled, theme, title, style, testID }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ paddingRight: 14 }, style]}
      disabled={!enabled}
      hitSlop={touchableArea}
      testID={`${testID}${!enabled ? 'Disabled' : ''}`}
    >
      <Text
        style={{
          fontSize: 17,
          color: enabled ? theme.color.primaryText : theme.color.disabledLink
        }}
      >
        {title || strings('header.button.save')}
      </Text>
    </TouchableOpacity>
  );
}

SaveBtn.propTypes = {
  enabled: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  testID: PropTypes.string,
  theme: PropTypes.object,
  title: PropTypes.string
};

export default withTheme(SaveBtn);
