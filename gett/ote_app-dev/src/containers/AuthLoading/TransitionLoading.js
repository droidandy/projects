import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import { View as AnimatableView } from 'react-native-animatable';

import { Icon, Background } from 'components';
import { deviceHeight, deviceWidth } from 'utils';

import styles from './style';

const SLIDE_IN_LEFT = { from: { translateX: 0 }, to: { translateX: 86 } };
const FADE_OUT = { from: { opacity: 1 }, to: { opacity: 0 } };

const SCALE_ANIM_PARAMS = {
  from: { scaleX: 0.01, scaleY: 0.01 },
  to: { scaleX: ((deviceWidth + 60) / 66), scaleY: ((deviceHeight + 60) / 68) }
};

const SCALE_RECTANGLE_ANIM = {
  style: { top: (deviceHeight / 2) - 34, position: 'absolute' },
  duration: 320,
  delay: 3100,
  animation: SCALE_ANIM_PARAMS,
  name: 'rectangle'
};

class TransitionLoading extends Component {
  static propTypes = {
    navigation: PropTypes.object
  };

  componentDidMount() {
    // if (!this.props.showAnimation) {
    //   this.handleOpenMap();
    // }

    this.handleOpenMap(); // temp, before loading animation declaration
  }

  handleOpenMap = () => {
    const { navigation } = this.props;

    if (navigation.isFocused()) {
      navigation.replace('MapView', { transition: 'loadTransition' });
    }
  };

  renderAnimation = ({
    name = 'logoLeft',
    animation = SLIDE_IN_LEFT,
    duration = 800,
    delay = 1000,
    useNativeDriver = false,
    style = {},
    onAnimationEnd = () => {},
    children = <Icon name={name} height={68} width={66} />
  }) => (
    <AnimatableView
      animation={animation}
      duration={duration}
      delay={delay}
      easing="linear"
      useNativeDriver={useNativeDriver}
      style={style}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </AnimatableView>
  );

  renderHideAnimation = children => (
    this.renderAnimation({ children, animation: FADE_OUT, duration: 600 })
  );

  renderAnimationWrapper = () => (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <Background>
        <View style={styles.container}>
          <View style={styles.logoRow}>
            {this.renderAnimation({ useNativeDriver: true, style: { height: 68, width: 68 } })}
            {this.renderHideAnimation(<Icon name="line" height={68} />)}
            {this.renderHideAnimation(<Icon name="logoRight" height={70} width={133} />)}
          </View>

          {this.renderAnimation({ ...SCALE_RECTANGLE_ANIM, onAnimationEnd: this.handleOpenMap })}
        </View>
      </Background>
    </View>
  )

  render() {
    // if (!this.props.showAnimation) return null;

    return null; // temp, before loading animation declaration
  }
}

const mapStateToProps = ({ app }) => ({
  showAnimation: app.devSettings.showSplashScreenAnimation
});

export default connect(mapStateToProps)(TransitionLoading);
