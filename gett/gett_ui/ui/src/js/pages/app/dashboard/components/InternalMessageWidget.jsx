import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MessageWidget } from 'components';
import { subscribe, post } from 'utils';
import dispatchers from 'js/redux/app/dashboard.dispatchers';
import Widget from './Widget';

import css from './Widget.css';

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
    addInternalMessage: PropTypes.func,
    name: PropTypes.string
  };

  handleNewMessage({ message }){
    this.props.addInternalMessage(message);
  }

  postMessage = (message) => {
    return post('/messages', { message });
  };

  render() {
    const { messages, showForm, className, name } = this.props;

    return (
      <Widget
        title="Internal messages"
        className={ css.widget25 }
        contentProps={ { className: 'p-0' } }
      >
        <MessageWidget
          className={ className }
          messages={ messages }
          showForm={ showForm }
          onFormSubmit={ this.postMessage }
          name={ name }
          height={ 360 }
        />
      </Widget>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(
  subscribe('messagesChannel', 'handleNewMessage')(InternalMessagesWidget)
);
