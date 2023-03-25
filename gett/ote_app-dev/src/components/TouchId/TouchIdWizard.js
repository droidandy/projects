import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Keychain from 'react-native-keychain';

import { setTouchIdStatus } from 'actions/app/statuses';

import { Input, Modal, Popup, Icon } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { session } from 'api';

import { components } from 'testIDs';

import { touchIdAuthenticate } from './utils';

import styles from './styles';

const IDs = components.TouchId;

class TouchIdWizard extends PureComponent {
  static propTypes = {
    onComplete: PropTypes.func,
    setTouchIdStatus: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    touchIdStatus: PropTypes.number
  };

  state = {
    isVisible: false,
    email: '',
    password: '',
    passwordErrors: undefined
  };

  setPopupRef = (el) => { this.popup = el; };

  start = () => {
    this.setState({ isVisible: true });
  };

  showPopup = () => {
    const { setTouchIdStatus, touchIdStatus } = this.props;
    setTouchIdStatus(touchIdStatus | 8);
    this.popup.open();
  };

  closePopup = () => {
    this.popup.close();
  };

  handlePasswordChange = (password) => {
    this.setState({ password, passwordErrors: undefined });
  };

  handleModalHide = () => this.setState({ isVisible: false });

  handlePasswordClear = () => this.handlePasswordChange('');

  handleModalClose = () => {
    const { onComplete } = this.props;
    this.handleModalHide();
    this.handlePasswordClear();
    if (onComplete) setTimeout(onComplete, 500);
  };

  handleSubmit = async () => {
    const { touchIdStatus, setTouchIdStatus, onComplete, email } = this.props;
    const { password } = this.state;
    try {
      await session.login({ password, email });
    } catch (res) {
      const error = res.response && res.response.status === 401
        ? res.response.data.error
        : strings('alert.message.userCanNotBeLogged');

      return this.setState({ passwordErrors: [error] });
    }

    this.handleModalHide();
    try {
      await touchIdAuthenticate();
    } catch (error) {
      this.handlePasswordClear();
      if (onComplete) onComplete();
      return console.log(error, 'Authentication Failed');
    }

    await Keychain.setGenericPassword(email, password);

    this.handlePasswordClear();
    setTouchIdStatus(touchIdStatus ^ 1);
    return setTimeout(this.showPopup, 350);
  };

  handleOpenTouchIdWizard = () => {
    this.closePopup();
    setTimeout(this.start, 350);
  };

  handleTouchIdSuggestClose = () => {
    const { onComplete } = this.props;
    this.closePopup();
    if (onComplete) setTimeout(onComplete, 500);
  };

  renderSuggestContent(isFaceId) {
    const { themedStyles } = this.props;

    return (
      <Fragment>
        <Text style={themedStyles.popupTitle}>
          {strings('popup.touchId.logInWith', { type: strings(`popup.touchId.${isFaceId ? 'faceId' : 'touchId'}`) })}
        </Text>
        <Text style={themedStyles.popupSubTitle}>
          {strings('popup.touchId.useYour', { type: strings(`popup.touchId.${isFaceId ? 'faceId' : 'touchId'}`) })}
        </Text>
        <Text style={themedStyles.popupCaution}>
          {strings('popup.touchId.caution', { type: strings(`popup.touchId.${isFaceId ? 'faceId' : 'touchId'}`) })}
        </Text>
      </Fragment>
    );
  }

  renderSuccess(isFaceId) {
    const { themedStyles } = this.props;

    return (
      <Text style={themedStyles.popupTitle}>
        {strings('popup.touchId.isReadyToGo', {
          type: strings(`popup.touchId.${isFaceId ? 'faceId' : 'touchId'}`)
        })}
      </Text>
    );
  }

  renderPopupContent() {
    const { touchIdStatus, themedStyles, theme } = this.props;
    const isFaceId = (touchIdStatus & 2) > 0;
    const isEnabled = (touchIdStatus & 1) > 0;

    return (
      <Fragment>
        <View style={themedStyles.popupIcon}>
          <Icon
            name={isFaceId ? 'faceId' : 'touchId'}
            color={theme.color.primaryBtns}
            size={60}
          />
          {isEnabled &&
            <Icon
              name="success"
              size={19}
              color={theme.color.success}
              style={themedStyles.popupSuccessIcon}
            />
          }
        </View>
        {isEnabled ? this.renderSuccess(isFaceId) : this.renderSuggestContent(isFaceId)}
      </Fragment>
    );
  }

  getPopupBtns = () => {
    const { touchIdStatus } = this.props;
    const isEnabled = (touchIdStatus & 1) > 0;
    return isEnabled
      ? [{ title: strings('alert.button.ok'), onPress: this.handleTouchIdSuggestClose }]
      : [
        {
          title: strings('popup.touchId.buttons.notNow'),
          type: 'secondary',
          onPress: this.handleTouchIdSuggestClose,
          testID: IDs.skip
        },
        {
          title: strings('popup.touchId.buttons.yes'),
          onPress: this.handleOpenTouchIdWizard
        }
      ];
  };

  renderSuggestPopup() {
    return (
      <Popup
        innerRef={this.setPopupRef}
        content={this.renderPopupContent()}
        buttons={this.getPopupBtns()}
        testID={IDs.modal}
      />
    );
  }

  render() {
    const { themedStyles } = this.props;
    const { isVisible, password, passwordErrors } = this.state;

    return (
      <Fragment>
        <Modal
          gesturesEnabled
          isVisible={isVisible}
          onClose={this.handleModalClose}
        >
          <Input
            value={password}
            onChangeText={this.handlePasswordChange}
            onSubmitEditing={this.handleSubmit}
            style={themedStyles.passwordInputWrapper}
            error={passwordErrors}
            blurOnSubmit={false}
            autoFocus
            autoCorrect={false}
            returnKeyLabel="Done"
            returnKeyType="done"
            containerStyle={themedStyles.passwordInput}
            errorStyle={themedStyles.passwordInputError}
            label={strings('auth.label.password')}
            secureTextEntry
          />
          <KeyboardSpacer />
        </Modal>
        {this.renderSuggestPopup()}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  touchIdStatus: app.statuses.touchIdStatus
});

const mapDispatchToProps = {
  setTouchIdStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TouchIdWizard, styles));
