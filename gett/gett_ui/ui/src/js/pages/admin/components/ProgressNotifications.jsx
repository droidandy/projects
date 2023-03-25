import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProgressLine from './ProgressLine';
import { notification } from 'components';
import { faye } from 'utils';

class ProgressNotifications extends Component {
  static propTypes = {
    channel: PropTypes.string
  };

  state = {
    open: false
  };

  componentDidUpdate() {
    const { channel } = this.props;
    if (channel && !this.subscription) {
      this.subscription = faye.on(channel, (message) => {
        if (message.success && !this.state.open) {
          this.setState({ open: true });
          this.showNotification(message);
        }
      });
    }
  }

  componentWillUnmount() {
    this.subscription.cancel();
  }

  showNotification(message) {
    const { channel } = this.props;
    notification.info(<ProgressLine channel={ channel } initialMessage={ message } />, {
      onClose: () => this.setState({ open: false }),
      message: message.data.title || 'Please wait...',
      duration: 0,
      className: 'infoDownload'
    });
  }

  render() {
    return null;
  }
}

export default (ProgressNotifications);
