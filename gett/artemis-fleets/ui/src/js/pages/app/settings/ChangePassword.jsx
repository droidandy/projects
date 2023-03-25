import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import { bindState } from 'components/form';
import { ChangePasswordForm } from './components';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return { email: state.settings.email };
}

class ChangePassword extends PureComponent {
  static propTypes = {
    email: PropTypes.string,
    getCurrentSession: PropTypes.func,
    updatePassword: PropTypes.func
  };

  componentDidMount() {
    this.props.getCurrentSession();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: { email: nextProps.email } });
  }

  updatePassword = (user, form) => {
    this.props.updatePassword(user)
      .then(() => this.setState({ form: { email: user.email } }))
      .then(() => message.success('Password successfully updated'))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  render() {
    return (
      <ChangePasswordForm { ...bindState(this) } onRequestSave={ this.updatePassword } />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(ChangePassword);
