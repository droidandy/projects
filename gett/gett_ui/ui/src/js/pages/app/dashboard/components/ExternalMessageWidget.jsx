import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MessageWidget } from 'components';
import { subscribe } from 'utils';
import dispatchers from 'js/redux/app/dashboard.dispatchers';
import Widget from './Widget';
import css from './Widget.css';

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

  handleNewMessage({ message }) {
    this.props.addExternalMessage(message);
  }

  render() {
    const { messages, className } = this.props;

    return (
      <Widget
        title="Gett Business Solutions Messages"
        className={ css.widget25 }
        contentProps={ { className: 'p-0' } }
      >
        <MessageWidget
          className={ className }
          messages={ messages }
          external
        />
      </Widget>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(
  subscribe('messagesChannel', 'handleNewMessage')(ExternalMessagesWidget)
);
