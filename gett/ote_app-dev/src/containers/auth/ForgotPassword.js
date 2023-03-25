import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StatusBar,
  TouchableWithoutFeedback,
  Text,
  KeyboardAvoidingView,
  View,
  BackHandler
} from 'react-native';
import validate from 'validate.js';

import { user } from 'api';

import { Icon, Input, DismissKeyboardView, Background, Button, AlertStatic } from 'components';
import { showConfirmationAlert, showInfoAlert, touchableArea } from 'utils';

import { strings } from 'locales';
import { color, withTheme } from 'theme';
import { containers } from 'testIDs';

import { resetPasswordRules } from './validatorRules';

import styles from './style';

const IDs = containers.ForgotPassword;

class ForgotPassword extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.object
  };

  state = {
    email: '',
    loading: false,
    error: null,
    touched: false
  };

  componentDidMount() {
    this.backListener = BackHandler.addEventListener('backPress', this.handleBackPress);
  }

  componentWillUnmount() {
    this.backListener.remove();
    BackHandler.removeEventListener('backPress');
  }

  handleBackPress = () => {
    const { touched, email } = this.state;
    const { theme } = this.props;

    if (touched && email !== '') {
      showConfirmationAlert({
        theme,
        title: strings('alert.message.areYouSure'),
        message: strings('alert.message.dataWillNotBeSaved'),
        handler: this.goBack
      });
      return true;
    }

    this.goBack();
    return true;
  };

  goBack = () => this.props.navigation.goBack(null);

  handleEmailChange = (value) => {
    this.setState({ email: value, touched: true, error: null });
    AlertStatic.hideAlert();
  };

  handleSubmit = () => {
    if (this.validateEmail()) {
      this.setState({ loading: true });
      user.forgotPassword({ email: this.state.email })
        .then(this.handleSuccessReset);
    }
  };

  handleSuccessReset = () => {
    this.setState({ loading: false });
    this.goToLogIn();
    this.props.navigation.state.params.onReturn({ isResetSuccess: true });
  };

  validateEmail() {
    const err = validate({ email: this.state.email }, resetPasswordRules);

    if (err) {
      this.setState({ error: err.email });
      showInfoAlert({ message: err.email[0], onClose: this.resetError });
    } else {
      this.resetError();
    }

    return !err;
  }

  resetError = () => {
    this.setState({ error: null });
  };

  goToLogIn = () => {
    AlertStatic.hideAlert();
    this.goBack();
  };

  render() {
    const { email, error, loading } = this.state;
    const isDisabled = !email || email.length === 0;
    return (
      <DismissKeyboardView style={styles.screen}>
        <StatusBar barStyle="light-content" />

        <Background>
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
          >
            <Icon name="logo" style={styles.logo} width={240} height={70} />
            <Input
              value={email}
              onChangeText={this.handleEmailChange}
              style={styles.input}
              autoCorrect={false}
              inputStyle={styles.inputStyle}
              containerStyle={styles.inputContainer}
              labelStyle={styles.label}
              label="Email"
              keyboardType="email-address"
              error={error}
              allowedError={false}
              errorStyle={styles.error}
              clearIconColor={color.white}
              testID={IDs.emailReset}
            />

            <View style={styles.btnsRow}>
              <Button
                disabled={isDisabled}
                loading={loading}
                onPress={this.handleSubmit}
                stretched
                style={styles.flex}
                title={strings('auth.button.resetPassword')}
                testID={isDisabled ? IDs.resetPasswordDisabled : IDs.resetPassword}
              />
            </View>
          </KeyboardAvoidingView>

          <TouchableWithoutFeedback onPress={this.goToLogIn} hitSlop={touchableArea}>
            <View style={styles.footer}>
              <Text style={[styles.footerText, styles.footerLink]} testID={IDs.loginFromForgot}>
                {strings('auth.label.logIn')}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Background>
      </DismissKeyboardView>
    );
  }
}

export default withTheme(ForgotPassword);
