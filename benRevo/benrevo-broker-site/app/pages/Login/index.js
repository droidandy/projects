/*
 *
 * LoginPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { LoginPage } from '@benrevo/benrevo-react-core';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {};
  render() {
    return (
      <LoginPage
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    params: ownProps.params,
  };
}

export default connect(mapStateToProps)(Login);
