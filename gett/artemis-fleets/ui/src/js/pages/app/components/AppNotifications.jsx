import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { subscribe, put, get } from 'utils';
import { pick } from 'lodash';

function mapStateToProps(state) {
  return pick(state.session, [
    'externalMessagesChannel', 'internalMessagesChannel', 'memberId'
  ]);
}

class AppNotifications extends PureComponent {
  static propTypes = {
    internalMessagesChannel: PropTypes.string,
    externalMessagesChannel: PropTypes.string,
    memberId: PropTypes.number
  };

  componentDidMount() {
    this.showPendingMessages();
  }

  showPendingMessages() {
    get('/messages/unread')
      .then((resp) => {
        resp.data.forEach(this.showMessage);
      });
  }

  showMessage = (message) => {
    // Do not show to user his own messages
    if (message.senderId === this.props.memberId) return;

    let description = message.body;

    if (message.title === 'Last Deploy' && !message.senderId) {
      description = <div className="rte-container" dangerouslySetInnerHTML={ { __html: description } } />;
    }

    notification.success({
      message: message.title,
      description: description,
      duration: 0,
      onClose: this.markAllMessagesAsRead
    });
  };

  handleNewMessage({ message }) {
    this.showMessage(message);
  }

  markAllMessagesAsRead() {
    put('/messages/mark_all_as_read');
  }

  render() {
    return null;
  }
}

export default connect(mapStateToProps)(
  subscribe({
    externalMessagesChannel: 'handleNewMessage',
    internalMessagesChannel: 'handleNewMessage'
  })(AppNotifications)
);
