import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { color } from 'theme';
import { Icon } from 'components/index';

const styles = StyleSheet.create({
  ratingHolder: {
    flexDirection: 'row',
    marginVertical: 13
  },
  starHolder: {
    paddingHorizontal: 5
  }
});

const Rating = ({ value, style, onChange, ratingCount, disabled }) => (
  <View style={[styles.ratingHolder, style]}>
    {Array.from(Array(ratingCount)).map((_, i) => {
      const isActive = value >= i + 1;
      return (
        <TouchableOpacity
          onPress={() => !disabled && onChange(i + 1)}
          activeOpacity={disabled ? 1 : 0.6}
          key={i}
          style={styles.starHolder}
        >
          <Icon
            name={isActive ? 'star' : 'starEmpty'}
            color={isActive ? color.primaryBtns : color.pixelLine}
            size={30}
          />
        </TouchableOpacity>
      );
    })}
  </View>
);

Rating.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  ratingCount: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  value: PropTypes.number
};

Rating.defaultProps = {
  onChange: () => {},
  ratingCount: 5,
  style: null,
  value: 0
};

export default Rating;
