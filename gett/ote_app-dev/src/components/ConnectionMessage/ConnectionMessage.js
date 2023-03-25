import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';

import { strings } from 'locales';

import { isIphoneX } from 'utils';

import styles from './styles';

class ConnectionMessage extends PureComponent {
  static propTypes = {
    onLayout: PropTypes.func
  };

  onLayout = (e) => {
    this.props.onLayout(e.nativeEvent.layout);
  };

  render() {
    return (
      <AnimatableView
        animation="slideInDown"
        onLayout={this.onLayout}
        duration={300}
        easing="linear"
        style={[styles.container, { height: isIphoneX() ? 100 : 80 }]}
      >
        <View style={styles.messageWrapper}>
          <Text style={styles.message}>{strings('connection.text.serviceFailure')}</Text>
          <Text style={styles.message}>{strings('connection.text.checkYourConnection')}</Text>
        </View>
      </AnimatableView>
    );
  }
}

export default ConnectionMessage;
