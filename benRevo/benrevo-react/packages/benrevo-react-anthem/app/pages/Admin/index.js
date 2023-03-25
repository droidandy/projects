/*
 *
 * AdminPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Admin } from '@benrevo/benrevo-react-core';

export class AdminPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    params: PropTypes.object.isRequired,
  };
  render() {
    return (
      <Admin />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    params: ownProps.params,
  };
}

export default connect(mapStateToProps)(AdminPage);
