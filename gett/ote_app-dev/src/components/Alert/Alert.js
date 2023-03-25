import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, View, Text, TouchableWithoutFeedback, StatusBar, InteractionManager } from 'react-native';
import { color } from 'theme';

import { Icon } from 'components';

import { strings } from 'locales';

import { isIphoneX, isAndroid } from 'utils';

import { utils } from 'testIDs';

import styles from './styles';

export default class Alert extends PureComponent {
  static propTypes = {
    delay: PropTypes.number,
    message: PropTypes.string,
    onClose: PropTypes.func,
    position: PropTypes.oneOf(['top', 'bottom']),
    testID: PropTypes.string,
    type: PropTypes.oneOf(['success', 'warning', 'failed', 'info'])
  };

  static defaultProps = {
    delay: 5000,
    message: '',
    position: 'top',
    type: 'info'
  };

  state = {
    message: '',
    position: 'top',
    type: 'failed',
    testID: '',
    onClose: null
  }

  alertAnim = new Animated.Value(0);

  hide = () => {
    this.animate(0);

    if (this.state.onClose) {
      InteractionManager.runAfterInteractions(this.state.onClose);
    }
    clearTimeout(this.timeout);
  };

  animate = (toValue) => {
    Animated.timing(
      this.alertAnim,
      {
        toValue,
        duration: 400
      }
    ).start();
  };

  get alertShift() {
    let shift = 8;

    if (isIphoneX()) shift = 24;
    if (isAndroid && this.state.position === 'top') shift = StatusBar.currentHeight;

    return shift;
  }

  render() {
    const { type, message, position, testID } = this.state;
    const multiplier = position === 'bottom' ? 1 : -1;

    return (
      <Animated.View
        style={[
          styles.container,
          styles[`container${position}`],
          {
            opacity: this.alertAnim,
            transform: [{
              translateY: this.alertAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [(120 + this.alertShift) * multiplier, -multiplier * this.alertShift]
              })
            }]
          }
        ]}
      >
        <View style={[styles.messageContainer, styles[`messageContainer${type}`]]} testID={testID}>
          <Icon name={type} width={28} height={28} color={color.white} />

          <Text style={styles.message} testID={`${testID}/${utils.alerts.message}`}>
            <Text style={styles.title}>{`${strings(`alert.status.${type}`)}. `}</Text>
            {message && <Text style={styles.description}>{message}</Text>}
          </Text>

          <TouchableWithoutFeedback onPress={this.hide}>
            <View style={styles.icon}>
              <Icon name="close" width={16} height={16} color={color.white} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    );
  }
}
