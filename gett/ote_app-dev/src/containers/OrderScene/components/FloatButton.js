import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { color, withTheme } from 'theme';

import { Icon } from 'components';

import { fbStyles } from './styles';

const FloatButton = ({ label, iconName, style, theme, loading, onPress, labelStyle, content, themedStyles }) => {
  const icons = {
    dispatcher: { name: 'dispatcher', size: 30, color: theme.isNightMode ? theme.color.white : theme.color.success },
    cancel: { name: 'closeThick', color: color.danger },
    walker: { name: 'walker', color: theme.color.primaryText },
    dots: { name: 'dots', color: theme.color.primaryText },
    myLocation: { name: 'myLocation', color: theme.color.primaryText },
    edit: { name: 'edit', width: 21, height: 26, color: theme.color.primaryText }
  };

  const handlePress = () => {
    if (!loading) {
      onPress();
    }
  };

  const renderInner = () => (content || <Icon {...icons[iconName]} />);

  return (
    <View style={[themedStyles.container, style]}>
      <View style={themedStyles.elevationButton}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.5}
      >
        <View style={themedStyles.button}>
          {loading
            ? <ActivityIndicator size="small" color={icons[iconName].color} />
            : renderInner()
          }
        </View>
      </TouchableOpacity>
      </View>
      <Text style={[themedStyles.label, labelStyle]}>{label}</Text>
    </View>
  );
};

FloatButton.propTypes = {
  content: PropTypes.node,
  iconName: PropTypes.oneOf(['cancel', 'walker', 'dots', 'myLocation', 'edit']),
  label: PropTypes.string,
  labelStyle: PropTypes.any,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  theme: PropTypes.object,
  themedStyles: PropTypes.object
};

FloatButton.defaultProps = {
  iconName: 'cancel',
  label: 'Submit',
  loading: false,
  onPress: () => {},
  style: {}
};

export default withTheme(FloatButton, fbStyles);
