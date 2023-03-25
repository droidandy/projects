import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Call, Videocam, PersonAdd } from '@material-ui/icons';
import readMessage from 'service/message/message';
import { sendMessage, editText } from 'service/message/editor';
import { sidebarShowAction } from 'action/nav';
import { nav } from 'type';
import { IconBtn, Message, MessageMy, UserDetails, Write } from 'components';
import RoomDetails from 'components/Room/RoomDetails';

class CurrentConversation extends Component {
  static propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired,
    roomSelected: PropTypes.object,
    me: PropTypes.object.isRequired,
    sidebar: PropTypes.string.isRequired,
    readMessage: PropTypes.func.isRequired,
    details: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    sidebarShowAction: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    editText: PropTypes.func.isRequired,
  };

  static defaultProps = {
    roomSelected: null,
  };

  componentDidUpdate() {
    if (this.view) {
      this.view.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  setRef = (el) => { this.view = el; };

  renderMessage = (message, index) => {
    const { me, readMessage } = this.props;
    const isMe = message?.user?.id === me?.id;
    const Component = isMe ? MessageMy : Message;
    return (
      <Component
        key={message?.id || index}
        message={message}
        readMessage={readMessage}
      />
    );
  };

  render() {
    const {
      isDesktop,
      sidebar,
      details,
      collection,
      sidebarShowAction,
      sendMessage,
      editText,
      text,
      roomSelected,
    } = this.props;
    const showRoomDetails = sidebar === nav.sideBar.details && details?.type;
    const showConversation = (sidebar === nav.sideBar.profile || isDesktop) && roomSelected?.id;
    return (
      <Fragment>
        {showConversation && (
          <main className="conversation">
            <div className="selfActions">
              <UserDetails
                centered
                data={{
                  ...details?.admin,
                  photo: details?.admin?.thumbnail?.xs,
                  title: details?.admin?.name,
                  subTitle: details?.admin?.company,
                }}
              />
              <div className="actions">
                <IconBtn className="icon" onClick={() => {}}><Call /></IconBtn>
                <IconBtn className="icon" onClick={() => {}}><Videocam /></IconBtn>
                <IconBtn className="icon" onClick={() => {}}><PersonAdd /></IconBtn>
              </div>
            </div>
            <div className="messages">
              <div className="items">
                {collection.map(this.renderMessage)}
                <div key="messagesFooter" ref={this.setRef} />
              </div>
              <Write
                value={text}
                sidebar={sidebar}
                onSidebarShow={sidebarShowAction}
                onSendMessage={sendMessage}
                onEditText={editText}
              />
            </div>
          </main>
        )}
        {showRoomDetails && (
          <RoomDetails
            className={`conversationDetails ${isDesktop ? 'default' : 'flex'}`}
            data={details}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ message, nav, room, user }) => ({
  details: room?.details,
  collection: message?.collection,
  text: message?.text,
  sidebar: nav?.sidebar,
  roomSelected: room?.selected,
  me: user?.me,
});

const mapDispatchToProps = { readMessage, sidebarShowAction, sendMessage, editText };

export default connect(mapStateToProps, mapDispatchToProps)(CurrentConversation);
