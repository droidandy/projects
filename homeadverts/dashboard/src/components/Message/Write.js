import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ClickAwayListener, Paper } from '@material-ui/core';
import { AttachFile, Send, Face, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { Picker } from 'emoji-mart';
import Textarea from 'react-textarea-autosize';
import { nav } from 'type';
import { Desktop } from 'components';

export default class Write extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    sidebar: PropTypes.string.isRequired,
    onSidebarShow: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onEditText: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  state = {
    emojiOpened: false,
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  showEmoji = () => {
    this.setState(state => ({
      emojiOpened: !state.emojiOpened,
    }));
  };

  hideEmoji = () => {
    this.setState({
      emojiOpened: false,
    });
  };

  send = () => {
    const { onSendMessage } = this.props;
    onSendMessage();
  };

  emojiClick = (emoji) => {
    const { value, onEditText } = this.props;
    onEditText(value + emoji.native);
  };

  onKeyPress = (event) => {
    const { onSendMessage } = this.props;
    if (event.key === 'Enter') {
      event.preventDefault();
      onSendMessage();
    }
  };

  onChange = (event) => {
    const { onEditText } = this.props;
    onEditText(event.target.value);
  };

  render() {
    const { value, sidebar, onSidebarShow } = this.props;
    const { emojiOpened } = this.state;

    return (
      <div className="messageWrite">
        <div className="messageContainer">
          <div className="buttons">
            <Send className="button" onClick={this.send} />
            <ClickAwayListener onClickAway={this.hideEmoji}>
              <Fragment>
                <Face className="button" onClick={this.showEmoji} />
                {emojiOpened && (
                  <Paper id="emojis">
                    <Picker onClick={this.emojiClick} />
                  </Paper>
                )}
              </Fragment>
            </ClickAwayListener>
            <AttachFile className="button" onClick={() => {}} />
          </div>
          <Textarea
            value={value}
            placeholder="Type a message"
            onKeyDown={this.onKeyPress}
            onChange={this.onChange}
          />
        </div>
        <Desktop>
          <div>
            {sidebar === nav.sideBar.profile
              ? <ChevronLeft className="detailsButton" onClick={() => onSidebarShow(nav.sideBar.details)} />
              : <ChevronRight className="detailsButton" onClick={() => onSidebarShow(nav.sideBar.profile)} />}
          </div>
        </Desktop>
      </div>
    );
  }
}
