import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindState } from 'components/form';
import PasswordForm from './components/PasswordForm';
import qs from 'qs';
import { auth, get, put } from 'utils';
import { notification } from 'antd';

export default class SetPassword extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    location: PropTypes.shape({ search: PropTypes.string })
  };

  state = {
    token: null,
    checked: false
  };

  componentDidMount() {
    const { token } = qs.parse(this.props.location.search.replace('?', ''));

    if (!token) return this.redirectToLogin();

    get('/session/token', { token })
      .then(() => this.setState({ token, checked: true }))
      .catch(this.redirectToLogin);
  }

  resetMode = false;

  updatePassword = (params, form) => {
    form.ifValid(() => {
      put('/user/reset_password', { ...params, resetPasswordToken: this.state.token })
        .then(response => auth.accept(response.data))
        .catch(e => form.setErrors(e.response.data.errors));
    });
  };

  redirectToLogin = () => {
    this.context.router.history.push('/');
    notification.error({
      message: 'Password reset token invalid',
      description: 'You already used this link to set your password once or the link has expired.',
      duration: 0
    });
  };

  render() {
    if (!this.state.checked) return null;

    return (
      <PasswordForm
        { ...bindState(this) }
        resetMode={ this.resetMode }
        onRequestSave={ this.updatePassword }
      />
    );
  }
}
