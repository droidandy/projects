import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notification } from 'components';
import { bindState } from 'components/form';
import { ChangePasswordForm } from './components';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return { email: state.session.email };
}

class ChangePassword extends PureComponent {
  static propTypes = {
    email: PropTypes.string,
    updatePassword: PropTypes.func
  };

  state = {
    form: { email: '' },
    prevPropsEmail: '',
  };

  static getDerivedStateFromProps({ email }, { prevPropsEmail }) {
    if (email !== prevPropsEmail) {
      return {
        form: { email },
        prevPropsEmail: email,
      };
    }
    return null;
  }

  updatePassword = (user, form) => {
    this.props.updatePassword(user)
      .then(() => this.setState({ form: { email: user.email } }))
      .then(() => notification.success('Password successfully updated'))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  render() {
    return (
      <ChangePasswordForm { ...bindState(this) } onRequestSave={ this.updatePassword } />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(ChangePassword);
