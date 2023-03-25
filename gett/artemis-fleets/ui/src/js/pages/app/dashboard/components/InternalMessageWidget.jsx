import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MessageWidget } from 'components';
import { subscribe, post } from 'utils';
import dispatchers from 'js/redux/app/dashboard.dispatchers';

function mapStateToProps(state) {
  return {
    messages: state.dashboard.data.internalMessages,
    messagesChannel: state.session.internalMessagesChannel
  };
}

class InternalMessagesWidget extends PureComponent {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    showForm: PropTypes.bool,
    className: PropTypes.string,
    addInternalMessage: PropTypes.func
  };

  handleNewMessage({ message }){
    this.props.addInternalMessage(message);
  }

  postMessage = (message) => {
    return post('/messages', { message });
  };

  render() {
    const { messages, className, showForm } = this.props;

    return (
      <MessageWidget
        title="Internal Company Message"
        className={ className }
        messages={ messages }
        showForm={ showForm }
        onFormSubmit={ this.postMessage }
      />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(
  subscribe('messagesChannel', 'handleNewMessage')(InternalMessagesWidget)
);
