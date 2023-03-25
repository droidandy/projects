import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribe } from 'utils';
import { MessageWidget } from 'components';
import { post } from 'utils';
import dispatchers from 'js/redux/admin/notifications.dispatchers';

function mapStateToProps(state) {
  return {
    messages: state.notifications.messages,
    messagesChannel: state.app.session.messagesChannel
  };
}

class Notifications extends PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    getMessages: PropTypes.func,
    addMessage: PropTypes.func
  }

  componentDidMount() {
    this.props.getMessages();
  }

  handleNewMessage({ message }){
    this.props.addMessage(message);
  }

  postMessage = (message) => {
    return post('/admin/messages', { message });
  };

  render() {
    const { messages } = this.props;

    return (
      <Fragment>
      <div className="page-title mb-30">Notifications</div>
        <MessageWidget
          messages={ messages }
          external
          title="Gett Business Solutions Messages"
          className="sm-full-width center-block"
          width={ 600 }
          height={ 400 }
          showForm
          onFormSubmit={ this.postMessage }
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(subscribe('messagesChannel', 'handleNewMessage')(Notifications));
