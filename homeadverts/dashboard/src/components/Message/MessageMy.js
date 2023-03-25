import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { roomDateFormat } from 'helper/formats';
import MessageStatus from './Status';

export default class MessageMy extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
  };

  render() {
    const { message } = this.props;

    return (
      <div className={`messageMy ${message.classes}`}>
        <div className="details">
          {message?.isFirst && (
            <div className="status">
              <MessageStatus isReadByAll={message?.isReadByAll} mocked={message?.mocked} />
              <Moment calendar={roomDateFormat} date={message?.timestamp} />
            </div>
          )}
          <div className="text">
            {message?.text}
          </div>
        </div>
      </div>
    );
  }
}
