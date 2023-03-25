import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MessageWidget } from 'components';
import { subscribe } from 'utils';
import dispatchers from 'js/redux/app/dashboard.dispatchers';

function mapStateToProps(state) {
  return {
    messages: state.dashboard.data.externalMessages,
    messagesChannel: state.session.externalMessagesChannel
  };
}

class ExternalMessagesWidget extends PureComponent {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    addExternalMessage: PropTypes.func
  };

  handleNewMessage({ message }){
    this.props.addExternalMessage(message);
  }

  render() {
    const { messages, className } = this.props;

    return (
      <MessageWidget
        title="One Transport Message"
        className={ className }
        messages={ messages }
        external
      />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(
  subscribe('messagesChannel', 'handleNewMessage')(ExternalMessagesWidget)
);
