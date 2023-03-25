import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';

export default class Notification extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  render() {
    const { data } = this.props;

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={data?.open}
        ContentProps={{ 'aria-describedby': 'notification' }}
        message={<span id="notification">{data?.text}</span>}
      />
    );
  }
}
