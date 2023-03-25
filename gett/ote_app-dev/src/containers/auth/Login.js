import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  TouchableWithoutFeedback,
  StatusBar,
  View,
  Text,
  ScrollView
} from 'react-native';
import { Answers } from 'react-native-fabric';
import validate from 'validate.js';

import {
  Background,
  Icon,
  Input,
  KeyboardAnimatedWrapper,
  KeyboardCustomAnimatedWrapper,
  DismissKeyboardView,
  TransitionView,
  Button,
  TouchIdBtn,
  TouchIdWizard
} from 'components';

import update from 'update-js/fp';
import { curry } from 'lodash';

import { login } from 'actions/session';
import { postEvent } from 'actions/app/gett';
import { setTouchIdStatus } from 'actions/app/statuses';

import { strings } from 'locales';

import { withTheme, color } from 'theme';

import {
  throttledAction, isIphoneX, isAndroid, isDevMode, prepareLogInProperties, showInfoAlert, touchableArea, deviceHeight
} from 'utils';
import { containers } from 'testIDs';

import { prepareCheckBlocks } from './utils';
import { loginRules } from './validatorRules';
import { CheckItem } from './components';

import styles from './style';

const BLOCK_HEIGHT = 478; // Height of logo + inputs block

let initialFormState = {
  email: '',
  password: '',
  acceptTac: false,
  acceptPp: false
};

if (isDevMode) {
  initialFormState = {
    email: 'artem@fakemail.com',
    password: 'qwqwqwQ@',
    acceptTac: true,
    acceptPp: true
  };
}

const IDs = containers.Login;
const { SingleInputEditor } = containers.Settings;

class Login extends PureComponent {
  constructor(props) {
    super(props);
    const fields = ['email', 'password', 'acceptTac', 'acceptPp'];
    this.handlers = {};
    fields.forEach((field) => {
      this.handlers[field] = this.handleInputChange(field);
    });
  }

  static propTypes = {
    isConnected: PropTypes.bool,
    login: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    postEvent: PropTypes.func,
    theme: PropTypes.object,
    touchIdStatus: PropTypes.number
  };

  state = {
    isResetSuccess: false,
    loading: false,
    form: initialFormState,
    showForm: !!this.props.navigation.state?.params?.disableTouchId,
    showTouchIdBtn: (this.props.touchIdStatus & 1) > 0
  };

  setPasswordRef = (el) => { this.password = el; };

  setTouchIdWizardRef = (el) => { this.touchIdWizard = el; };

  componentDidMount() {
    const { postEvent, navigation } = this.props;
    postEvent('registration_screen|screen_appears');
    navigation.setParams({ theme: this.props.theme });
  }

  componentDidUpdate(_, { isResetSuccess }) {
    if (this.state.isResetSuccess && !isResetSuccess) {
      showInfoAlert({
        type: 'success',
        message: strings('auth.text.passwordWasReset'),
        onClose: this.onCloseAlert,
        testID: IDs.resetNotification
      });
    }
  }

  handleInputChange = curry((input, value) => {
    this.setState(update(`form.${input}`, value));
  });

  handleFocusPassword = () => this.password.focus();

  handleCloseKeyboard = () => this.password.blur();

  handleSubmit = async () => {
    const { form } = this.state;
    const { postEvent, touchIdStatus, login } = this.props;
    if (this.validateInputs()) {
      postEvent('registration_screen|log_in|button_clicked', prepareLogInProperties(form));
      this.setState({ loading: true });
      login(form)
        .then(() => this.setState({ loading: false }))
        .then(() => {
          if (touchIdStatus & (2 | 4) && !(touchIdStatus & (1 | 8))) {
            return this.touchIdWizard.showPopup();
          }
          return this.goToMainPaige();
        })
        .catch(this.handleLoginError);
    }
  };

  handleLoginError = (err) => {
    const error = err.status === 401
      ? err.data.error
      : strings('alert.message.userCanNotBeLogged');

    Answers.logLogin('Basic', false, { error });
    this.setState({ loading: false });
    showInfoAlert({ message: error, testID: IDs.loginErrorAlert });
  };

  handleActivation = (data) => {
    this.setState(data);
  };

  validateInputs() {
    const err = validate(this.state.form, loginRules);

    if (err) {
      const errorMessage = (err.email && err.email[0]) || (err.password && err.password[0]);

      showInfoAlert({ message: errorMessage, testID: IDs.loginErrorAlert });
    }

    return !err;
  }

  showLoginForm = () => {
    this.setState({ showForm: true });
  };

  handleTouchIdLoginFailed = () => {
    this.setState({ showForm: true, showTouchIdBtn: false });

    showInfoAlert({ type: 'warning', message: strings('alert.message.touchIdCredentials') });
  };

  onCloseAlert = () => {
    this.setState({ isResetSuccess: false });
  };

  goToCreateAccount = () => {
    const { postEvent, navigation } = this.props;
    postEvent('registration_screen|new_account|button_clicked');
    navigation.navigate('Registration', {});
  };

  goToForgot = () => {
    this.props.navigation.navigate('ForgotPassword', { onReturn: this.handleActivation });
  };

  goToMainPaige = () => {
    const { navigation } = this.props;
    navigation.navigate('MapView', { theme: navigation.state.params.theme });
  };

  goToInfoPage = throttledAction((page) => {
    Answers.logContentView(`${strings(`information.${page}`)} was opened`, 'screen view', `${page}Open`);
    this.props.navigation.navigate('InfoPages', { page, theme: this.props.theme });
  });

  goToTermsConditions = () => this.goToInfoPage('termsConditions');

  goToPrivacyPolicy = () => this.goToInfoPage('privacyPolicy');

  renderCheckItem = (props, index) => <CheckItem key={index} {...props} />;

  getCenteredLogoPosition = () => {
    const statusBarHeight = isIphoneX() ? 40 : StatusBar.currentHeight || 22;
    const LOGO_HEIGHT = 156; // logo: 96 + 30*2 marginVertical

    const topPosition = ((deviceHeight - BLOCK_HEIGHT) + statusBarHeight) / 2;
    const centerY = (deviceHeight / 2) - (LOGO_HEIGHT / 2);

    const statusBarPadding = isAndroid ? StatusBar.currentHeight : 0;

    return (centerY - topPosition) + statusBarPadding;
  };

  renderForm = (Wrapper) => {
    const { navigation, touchIdStatus } = this.props;
    const { form, loading, showForm, showTouchIdBtn } = this.state;

    const checkBlocks = prepareCheckBlocks(form, {
      handleAcceptTacChange: this.handlers.acceptTac,
      handleAcceptPpChange: this.handlers.acceptPp,
      goToTermsConditions: this.goToTermsConditions,
      goToPrivacyPolicy: this.goToPrivacyPolicy
    });

    const smallFormArea = deviceHeight < (BLOCK_HEIGHT + 130) || !this.props.isConnected;
    const btnDisabled = !form.acceptTac || !form.acceptPp;
    const isTouchIdEnabled = (touchIdStatus & 1) > 0;

    return (
      <Wrapper style={isTouchIdEnabled && !showForm && styles.hide}>
        <Input
          value={form.email}
          onChangeText={this.handlers.email}
          onSubmitEditing={this.handleFocusPassword}
          style={styles.input}
          blurOnSubmit={false}
          autoFocus={false}
          autoCorrect={false}
          containerStyle={styles.inputContainer}
          inputStyle={styles.inputStyle}
          labelStyle={styles.label}
          label={strings('auth.label.email')}
          keyboardType="email-address"
          clearIconColor={color.white}
          clearIconTestID={SingleInputEditor.emailClearIcon}
          testID={IDs.emailInput}
        />
        <Input
          inputRef={this.setPasswordRef}
          value={form.password}
          onChangeText={this.handlers.password}
          onSubmitEditing={this.handleCloseKeyboard}
          style={styles.input}
          blurOnSubmit={false}
          autoFocus={false}
          autoCorrect={false}
          inputStyle={styles.inputStyle}
          containerStyle={styles.inputContainer}
          labelStyle={styles.label}
          label={strings('auth.label.password')}
          secureTextEntry
          clearIconColor={color.white}
          clearIconTestID={SingleInputEditor.passwordClearIcon}
          testID={IDs.passwordInput}
        />
        <View style={styles.btnForgot}>
          <TouchableWithoutFeedback onPress={this.goToForgot} hitSlop={touchableArea}>
            <View>
              <Text style={styles.forgotText} testID={IDs.forgotPassword}>{strings('auth.text.forgotPassword')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {checkBlocks.map(this.renderCheckItem)}
        <View style={styles.btnsRow}>
          <Button
            disabled={btnDisabled}
            loading={loading}
            onPress={this.handleSubmit}
            stretched
            style={styles.flex}
            title={strings('auth.label.logIn')}
            testID={`${IDs.loginButton}${btnDisabled ? IDs.disabled : ''}`}
          />
          {isTouchIdEnabled && showTouchIdBtn &&
            <TouchIdBtn
              disabled={btnDisabled}
              navigation={navigation}
              onAuthFailed={this.showLoginForm}
              onLoginFailed={this.handleTouchIdLoginFailed}
              autoOpening={!this.props.navigation.state?.params?.disableTouchId}
            />
          }
        </View>
        {smallFormArea && this.renderFooter(Wrapper)}
      </Wrapper>
    );
  };

  renderFooter = Wrapper => (
    <Wrapper>
      <View style={styles.footer}>
        <TouchableWithoutFeedback
          onPress={this.goToCreateAccount}
          hitSlop={touchableArea}
          testID={IDs.registrationButton}
        >
          <View>
            <Text style={[styles.footerText, styles.footerLink]}>
              {strings('auth.text.openAccountToday')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Wrapper>
  );

  renderContent = () => {
    const { params } = this.props.navigation.state;

    const AnimatedWrapper = (params && params.disableAnimation) || !this.props.isConnected ? View : TransitionView;
    const smallFormArea = deviceHeight < (BLOCK_HEIGHT + 130) || !this.props.isConnected;
    const Wrapper = smallFormArea ? ScrollView : View;

    return (
      <Background testID={IDs.bgImage}>
        <View style={styles.container} testID={IDs.container}>
          <AnimatedWrapper scale value={this.getCenteredLogoPosition()}>
            <KeyboardAnimatedWrapper>
              <Icon name="logo" style={styles.logo} width={240} height={96} testID={IDs.logoIcon} />
            </KeyboardAnimatedWrapper>
          </AnimatedWrapper>

          <KeyboardCustomAnimatedWrapper>
            <Wrapper
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
            >
              {this.renderForm(AnimatedWrapper)}
            </Wrapper>
          </KeyboardCustomAnimatedWrapper>
        </View>
        {!smallFormArea && this.renderFooter(AnimatedWrapper)}
      </Background>
    );
  };

  render() {
    const { form } = this.state;

    return (
      <DismissKeyboardView style={styles.screen}>
        <StatusBar barStyle="light-content" />

        {this.renderContent()}

        <TouchIdWizard
          innerRef={this.setTouchIdWizardRef}
          email={form.email}
          onComplete={this.goToMainPaige}
        />
      </DismissKeyboardView>
    );
  }
}

const mapStateToProps = ({ network, app }) => ({
  isConnected: network.isConnected,
  touchIdStatus: app.statuses.touchIdStatus
});

const mapDispatchToProps = {
  login,
  postEvent,
  setTouchIdStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Login));
