import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';

import { color } from 'theme';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: color.secondaryText,
    padding: 4,
    borderRadius: 9,
    minWidth: 18,
    minHeight: 18,
    alignItems: 'center'
  },
  badgeText: {
    color: color.white,
    fontSize: 9,
    lineHeight: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

function Badge({ style, textStyle, value, ...rest }) {
  return (
    <View style={[styles.badge, style]} pointerEvents="none" {...rest}>
      <Text style={[styles.badgeText, textStyle]}>{value}</Text>
    </View>
  );
}

Badge.propTypes = {
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  textStyle: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Badge;
