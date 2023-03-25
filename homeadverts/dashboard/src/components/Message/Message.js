import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { UserPhoto } from 'components';
import { roomDateFormat } from 'helper/formats';
import MessageStatus from './Status';

export default class Message extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    readMessage: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { message, readMessage } = this.props;
    readMessage(message);
  }

  get data() {
    const { message } = this.props;
    return { ...message?.user, online: false, photo: message?.user?.thumbnail?.xs };
  }

  render() {
    const { message } = this.props;

    if (message?.isFirst) {
      return (
        <div className={`message ${message.classes}`}>
          <UserPhoto size={35} data={this.data} />

          <div className="details">
            <div className="status">
              <Moment calendar={roomDateFormat} date={message?.timestamp} />
              <MessageStatus isReadByAll={message?.isReadByAll} mocked={message?.mocked} />
            </div>
            <div className="text">
              {message?.text}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`message __noAvatar ${message.classes}`}>
        <div className="details">
          <div className="text">
            {message?.text}
          </div>
        </div>
      </div>
    );
  }
}
