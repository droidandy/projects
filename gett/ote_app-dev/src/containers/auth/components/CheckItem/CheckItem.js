import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { noop } from 'lodash';

import { Icon } from 'components';

import { formattedColor } from 'theme';
import { containers } from 'testIDs';

import { touchableArea } from 'utils';

import styles from './style';

const { utils } = containers;

export default class CheckItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    labelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    link: PropTypes.string,
    linkStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onLinkPress: PropTypes.func,
    onValueChange: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    testID: PropTypes.string,
    trackColor: PropTypes.object,
    value: PropTypes.bool
  };

  static defaultProps = {
    onLinkPress: () => noop,
    onValueChange: () => noop,
    trackColor: { true: formattedColor.white.opacity(0.8), false: formattedColor.white.opacity(0.2) },
    value: false
  };

  handleCheckPress = () => {
    const { value, onValueChange } = this.props;

    onValueChange(!value);
  };

  render() {
    const { style, labelStyle, label, onLinkPress, link, linkStyle, value, testID } = this.props;

    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback
          onPress={this.handleCheckPress}
          hitSlop={touchableArea}
          testID={`${testID}/${utils.switcher}`}
        >
          <View style={styles.checkbox}>
            <Icon name={value ? 'squareCheckOn' : 'squareCheckOff'} />
          </View>
        </TouchableWithoutFeedback>
        {label && <Text style={[styles.label, labelStyle]} numberOfLines={1}>{label}</Text>}
        {link &&
          <TouchableWithoutFeedback onPress={onLinkPress} hitSlop={touchableArea} testID={`${testID}/${utils.link}`}>
            <View style={styles.labelView}>
              <Text style={[styles.label, styles.link, linkStyle]} numberOfLines={1}>{link}</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>
    );
  }
}
