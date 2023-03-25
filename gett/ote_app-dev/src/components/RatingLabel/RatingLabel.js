import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Icon } from 'components';
import { color } from 'theme';
import styles from './styles';

export default class RatingLabel extends Component {
  static propTypes = {
    label: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  };

  static defaultProps = {
    label: 0,
    style: {}
  };

  render() {
    const { style, label } = this.props;

    return (
      <View style={[styles.rating, style]}>
        <Text style={styles.ratingLabel}>{label.toFixed(1)}</Text>
        <Icon name="star" size={12} color={color.white} />
      </View>
    );
  }
}
