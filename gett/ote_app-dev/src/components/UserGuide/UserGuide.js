import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, View, Text, StyleSheet, StatusBar } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';
import NativeModal from 'react-native-modal';
import { capitalize, isEmpty, noop } from 'lodash';
import { connect } from 'react-redux';
import { passGuide, resetGuide } from 'actions/session';
import { guideEnableNext } from 'actions/app/statuses';
import { postEvent } from 'actions/app/gett';

import { Icon } from 'components';
import { strings } from 'locales';
import { isIphoneX, isAndroid, deviceWidth } from 'utils';
import { withTheme } from 'theme';
import { containers } from 'testIDs';

import { prepareData, skipAnimation, statusBarHeight } from './utils';
import styles from './styles';

const IDs = containers.UserGuide;

const padding = 8;

class UserGuide extends PureComponent {
  static propTypes = {
    app: PropTypes.object,
    enableNext: PropTypes.bool,
    goToNextGuide: PropTypes.func,
    guideEnableNext: PropTypes.func,
    passengerData: PropTypes.object,
    passGuide: PropTypes.func.isRequired,
    postEvent: PropTypes.func,
    scrollTo: PropTypes.func,
    theme: PropTypes.object,
    type: PropTypes.string,
    user: PropTypes.object
  };

  static defaultProps = {
    enableNext: false,
    goToNextGuide: noop,
    scrollTo: noop,
    type: 'map'
  };

  state = {
    step: 0
  };

  componentDidMount() {
    const { type, postEvent } = this.props;
    this.changeSteps();
    postEvent('welcome_tour|screen_appears', { type });
  }

  componentDidUpdate() {
    const { type } = this.props;
    const { step } = this.state;
    if (step > 0) {
      const position = prepareData[type][step - 1].position;
      if (position) {
        this.props.scrollTo(position);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateStep = () => {
    const { type } = this.props;
    this.setState((prevState) => {
      const step = prevState.step + 1;

      if (step + 1 > prepareData[type].length) {
        clearInterval(this.interval);
      }

      return { step };
    });
  };

  changeSteps = () => {
    const displayByStep = this.stepType() === 'byStep';
    this.interval = setInterval(this.updateStep, displayByStep ? 2500 : 2000);
  };

  handleNextStep = () => {
    const { type } = this.props;
    const { step } = this.state;
    if (step < prepareData[type].length) {
      this.updateStep();
    }
  };

  handleSkip = () => {
    const { guideEnableNext, passGuide, postEvent } = this.props;
    clearInterval(this.interval);
    passGuide();
    guideEnableNext(false);
    postEvent('welcome_tour|skip|button_clicked');
  };

  renderHole = (width, height, step) => (
    <View style={[styles.holeWrapper, { height, width }]} testID={`${this.props.type}/hole/${step}`}>
      <View
        style={[
          styles.hole,
          {
            height: height + (2 * padding),
            width: width + (2 * padding),
            top: -padding,
            left: -padding
          }
        ]}
      />
    </View>
  );

  renderSideGap = () => <View style={[styles.backdrop, { width: 6 }]} />;

  renderMiddleGap = () => <View style={[styles.backdrop, styles.flex]} />;

  renderStep = ({ arrowName, arrowW, arrowH, title, subTitle, isRow = false }, index) => {
    const { type, app: { statuses }, passengerData } = this.props;
    const paymentCardsAvailable = passengerData.can?.seePaymentCards;

    const containerStyle = StyleSheet.flatten(styles[`step${capitalize(type)}${index + 1}`]);
    const updatedStyle = statuses.params.connectBar.height
      ? { top: (containerStyle.top + statuses.params.connectBar.height + 5) - statusBarHeight }
      : {};

    // Hack for stepSettings2 and stepSettings3 in styles,
    // because styles don't know about visibility block of payment cards.
    // 50 - height of payment card block.
    const updateSettingsStyles = type === 'settings' && paymentCardsAvailable && this.state.step > 1
      ? { top: containerStyle.top + 50 }
      : {};

    return (
      <AnimatedView
        key={index}
        useNativeDriver
        animation="fadeInUp"
        style={[
          styles[`step${capitalize(type)}${index + 1}`],
          updatedStyle,
          updateSettingsStyles,
          isRow ? styles.rowCenter : {},
          { marginVertical: isIphoneX() ? 20 : 0 }
        ]}
        testID={`${this.props.type}/step/${index + 1}`}
      >
        <Icon name="UGPointer" width={25} height={35} style={[styles.pointer, isRow ? styles.pointerRow : {}]} />
        <AnimatedView
          useNativeDriver
          animation="fadeIn"
          delay={750}
          style={styles[`arrow${capitalize(type)}${index + 1}`]}
        >
          <Icon name={arrowName} width={arrowW} height={arrowH} />
        </AnimatedView>
        <View style={styles.centerItems}>
          <Text style={styles.hintText}>{title}</Text>
          <Text style={styles.hintText}>{subTitle}</Text>
        </View>
      </AnimatedView>
    );
  };

  handleNext = () => {
    clearInterval(this.interval);
    this.props.goToNextGuide();
  };

  renderActions = () => {
    const { enableNext, type, goToNextGuide } = this.props;
    const { step } = this.state;
    const isEnableNext = enableNext && goToNextGuide !== noop;
    const isFinish = step >= prepareData[type].length && (
      (enableNext && goToNextGuide === noop) ||
      !enableNext
    );

    const button = isFinish ? strings('userGuide.finish') : strings('userGuide.skip');
    return (
      <View
        style={[
          styles.actionsPanel,
          { marginBottom: isIphoneX() || isAndroid ? 15 : 0 },
          isEnableNext ? { justifyContent: 'space-between' } : { justifyContent: 'center' }
        ]}
      >
        <TouchableWithoutFeedback onPress={this.handleSkip}>
          <AnimatedView
            animation={skipAnimation}
            delay={8000}
            iterationCount={10}
            useNativeDriver
            style={styles.btn}
          >
            <Text style={styles.btnText} testID={IDs[`${button.toLowerCase()}Button`]}>{button}</Text>
          </AnimatedView>
        </TouchableWithoutFeedback>
        {isEnableNext &&
          <TouchableWithoutFeedback onPress={this.handleNext} testID={IDs.nextButton}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>{strings('userGuide.next')}</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>
    );
  };

  mapLayout = () => {
    const { step } = this.state;
    const { app: { statuses } } = this.props;
    return (
      <Fragment>
        {isAndroid &&
          <View style={[styles.backdrop, { height: statuses.params.connectBar.height ? 5 : 0 }]} />
        }
        <View style={styles.row}>
          {this.renderSideGap()}
          {step > 2 && this.renderHole(56, 52, 1)}
          {this.renderMiddleGap()}
          {step > 1 && this.renderHole(104, 52, 2)}
          {this.renderSideGap()}
        </View>
        {this.renderMiddleGap()}
        <View style={styles.row}>
          {this.renderSideGap()}
          {this.renderHole(deviceWidth - 12, 100, 3)}
          {this.renderSideGap()}
        </View>
        {isAndroid &&
          <View style={[styles.backdrop, { height: StatusBar.currentHeight }]} />
        }
      </Fragment>
    );
  };

  ordersLayout = () => {
    const { step } = this.state;
    const { app: { statuses } } = this.props;
    return (
      <Fragment>
        <View style={[styles.backdrop, { height: 53 }]} />
        {isAndroid &&
          <View style={[styles.backdrop, { height: statuses.params.connectBar.height ? 5 : 0 }]} />
        }
        <View style={styles.row}>
          {this.renderSideGap()}
          {this.renderHole(deviceWidth - 12, 52, 1)}
          {this.renderSideGap()}
        </View>
        <View style={[styles.backdrop, { height: 200 }]} />
        <View style={styles.row}>
          {this.renderSideGap()}
          {step > 1 && this.renderHole(deviceWidth - 12, 149, 2)}
          {this.renderSideGap()}
        </View>
        {this.renderMiddleGap()}
      </Fragment>
    );
  };

  settingsLayout = () => {
    const { step } = this.state;
    const { app: { statuses }, passengerData } = this.props;
    const paymentCardsAvailable = passengerData.can?.seePaymentCards;

    return (
      <Fragment>
        <View style={[styles.backdrop, { height: isIphoneX() ? 231 : 224 }]} />
        {isAndroid &&
          <View style={[styles.backdrop, { height: statuses.params.connectBar.height ? 19 : 12 }]} />
        }
        <View style={styles.row}>
          {this.renderSideGap()}
          {step <= 1 && this.renderHole(deviceWidth - 12, 52, 1)}
          {this.renderSideGap()}
        </View>
        {step > 0 && <View style={[styles.backdrop, { height: paymentCardsAvailable ? 132 : 77 }]} />}
        <View style={styles.row}>
          {this.renderSideGap()}
          {step === 2 && this.renderHole(deviceWidth - 12, 166, 2)}
          {this.renderSideGap()}
        </View>
        <View style={styles.row}>
          {this.renderSideGap()}
          {step === 3 && this.renderHole(deviceWidth - 12, 52, 3)}
          {this.renderSideGap()}
        </View>
        {this.renderMiddleGap()}
      </Fragment>
    );
  };

  renderGuideLayout = () => {
    const { type } = this.props;
    const guideLayout = {
      map: this.mapLayout(),
      orders: this.ordersLayout(),
      settings: this.settingsLayout()
    };
    return guideLayout[type];
  };

  stepType = () => {
    const { type } = this.props;
    const isSettingsType = type === 'settings';
    return (isSettingsType ? 'byStep' : 'default');
  };

  renderDisplayStep = () => {
    const { step } = this.state;
    const { type } = this.props;
    const displayByStep = this.stepType() === 'byStep';
    return displayByStep
      ? this.renderStep(prepareData[type][step - 1], step - 1)
      : Array.from(new Array(step)).map((_, i) => this.renderStep(prepareData[type][i], i));
  };

  render() {
    const { type, theme, app: { statuses }, user } = this.props;
    const { step } = this.state;
    const allowRendering = step > 0 && prepareData[type][step - 1];

    return (
      <NativeModal
        isVisible={!isEmpty(user) && !user.guidePassed}
        backdropColor={!theme.isNightMode ? theme.color.backdrop : theme.formattedColor.bgSecondary.opacity(0.8)}
        backdropOpacity={0}
        style={styles.modal}
        onBackButtonPress={this.handleSkip}
        onBackdropPress={this.handleSkip}
      >
        <TouchableWithoutFeedback onPress={this.handleNextStep}>
          <AnimatedView duration={1500} animation="fadeIn" useNativeDriver style={styles.wrapper}>
            <View style={[styles.backdrop, { height: statuses.params.connectBar.height || statusBarHeight }]} />
            {this.renderGuideLayout()}
            <View style={[styles.backdrop, { height: isIphoneX() ? 85 : 70 }]} />
            {this.renderActions()}
            {allowRendering && this.renderDisplayStep()}
          </AnimatedView>
        </TouchableWithoutFeedback>
      </NativeModal>
    );
  }
}

const mapStateToProps = ({ app, passenger, session: { user } }) => ({
  app,
  enableNext: app.statuses.guideEnableNext,
  passengerData: passenger.data,
  user
});

const mapDispatchToProps = {
  guideEnableNext,
  passGuide,
  postEvent,
  resetGuide
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(UserGuide));
