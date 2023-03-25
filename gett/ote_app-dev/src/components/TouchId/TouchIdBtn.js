import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Keychain from 'react-native-keychain';

import { setTouchIdStatus } from 'actions/app/statuses';
import { login } from 'actions/session';
import { postEvent } from 'actions/app/gett';

import { Button, Icon } from 'components';

import { withTheme } from 'theme';

import { touchIdAuthenticate } from './utils';

import styles from './styles';

class TouchIdBtn extends PureComponent {
  static propTypes = {
    autoOpening: PropTypes.bool,
    disabled: PropTypes.bool,
    login: PropTypes.func,
    navigation: PropTypes.object,
    onAuthFailed: PropTypes.func,
    onLoginFailed: PropTypes.func,
    setTouchIdStatus: PropTypes.func,
    themedStyles: PropTypes.object,
    touchIdStatus: PropTypes.number
  };

  state = {
    isVisible: false,
    email: '',
    password: '',
    passwordErrors: undefined,
    loading: false
  };

  componentDidMount() {
    if (this.props.autoOpening) {
      this.timeout = setTimeout(this.handleTouchIdPress, 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleTouchIdPress = async () => {
    const { navigation, login, touchIdStatus, setTouchIdStatus, onAuthFailed, onLoginFailed, postEvent } = this.props;

    try {
      await touchIdAuthenticate();
    } catch (e) {
      onAuthFailed();
      // todo add error alert
      return console.log(e, 'Authentication Failed');
    }

    let credentials = null;

    try {
      credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        // todo add error alert
        return console.log('No credentials stored');
      }
    } catch (error) {
      // todo add error alert
      return console.log('Keychain couldn\'t be accessed!', error);
    }

    try {
      this.setState({ loading: true });
      await login({ email: credentials.username, password: credentials.password });
    } catch (e) {
      this.setState({ loading: false });
      setTouchIdStatus(touchIdStatus ^ 9);
      await Keychain.resetGenericPassword();
      return onLoginFailed();
    }
    postEvent(`login|${(touchIdStatus & 2) ? 'face_id' : 'touch_id'}|button_clicked`);
    this.setState({ loading: false });
    return navigation.navigate('MapView', { theme: navigation.state.params.theme });
  };

  render() {
    const { themedStyles, touchIdStatus, disabled } = this.props;
    const { loading } = this.state;

    return (
      <Button
        disabled={disabled}
        loading={loading}
        onPress={this.handleTouchIdPress}
        styleContent={themedStyles.touchBtn}
      >
        {!loading && <Icon name={(touchIdStatus & 2) ? 'faceId' : 'touchId'} />}
      </Button>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  touchIdStatus: app.statuses.touchIdStatus
});

const mapDispatchToProps = {
  login,
  postEvent,
  setTouchIdStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TouchIdBtn, styles));
