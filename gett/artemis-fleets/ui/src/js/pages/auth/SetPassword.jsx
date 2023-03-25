import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindState } from 'components/form';
import PasswordForm from './components/PasswordForm';
import qs from 'qs';
import { auth, put, get } from 'utils';
import { notification } from 'antd';

export default class SetPassword extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({ search: PropTypes.string })
  };

  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    checked: false
  };

  componentDidMount() {
    if (!this.token) this.redirectToLogin();

    get('/user/check_token', { resetPasswordToken: this.token })
      .then(() => this.setState({ checked: true }))
      .catch(this.redirectToLogin);
  }

  get token() {
    return qs.parse(this.props.location.search.replace('?', '')).token;
  }

  redirectToLogin = () => {
    this.context.router.history.push('/');
    notification.error({
      message: 'Password reset token invalid',
      description: 'You already used this link to set your password once or the link has expired.',
      duration: 10
    });
  };

  resetMode = false;

  updatePassword = (params, form) => {
    form.ifValid(() => {
      put('/user/reset_password', { ...params, resetPasswordToken: this.token })
        .then(response => auth.accept(response.data))
        .catch(e => form.setErrors(e.response.data.errors));
    });
  };

  render() {
    if(!this.state.checked) return null;

    return (
      <PasswordForm
        { ...bindState(this) }
        resetMode={ this.resetMode }
        onRequestSave={ this.updatePassword }
      />
    );
  }
}
