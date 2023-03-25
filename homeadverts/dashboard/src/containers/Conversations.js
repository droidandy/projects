import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Apps } from '@material-ui/icons';
import Rooms from 'components/Room/Rooms';
import SearchPanel from 'components/Room/SearchPanel';
import { searchUser, clearSearch } from 'action/search';
import { drawerShowAction } from 'action/nav';
import { selectRoom } from 'service/room/roomLoader';
import { joinUserRoom } from 'service/initializer';
import { IconBtn, UserDetails } from 'components';
import { CurrentConversation } from 'containers';

class Conversations extends Component {
  static propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    roomSearch: PropTypes.string.isRequired,
    clearSearch: PropTypes.func.isRequired,
    searchUser: PropTypes.func.isRequired,
    selectRoom: PropTypes.func.isRequired,
    joinUserRoom: PropTypes.func.isRequired,
    drawerShowAction: PropTypes.func.isRequired,
    roomSelected: PropTypes.object,
    search: PropTypes.object.isRequired,
    collection: PropTypes.array.isRequired,
    me: PropTypes.object.isRequired,
  };

  static defaultProps = {
    roomSelected: null,
  };

  render() {
    const {
      isDesktop,
      search,
      roomSearch,
      selectRoom,
      joinUserRoom,
      roomSelected,
      collection,
      searchUser,
      clearSearch,
      me,
      drawerShowAction,
    } = this.props;
    return (
      <Fragment>
        {roomSelected?.id && !isDesktop && <CurrentConversation isDesktop={isDesktop} />}
        {(isDesktop || !roomSelected) && (
          <aside className={`conversations ${isDesktop ? 'default' : 'flex'}`}>
            <div className="selfActions">
              <UserDetails
                centered
                data={{ title: me?.name, online: true, photo: me?.thumbnail?.xs }}
              />
              <IconBtn onClick={() => drawerShowAction('nav')}><Apps /></IconBtn>
            </div>
            <SearchPanel
              isDesktop={isDesktop}
              value={roomSearch}
              onChangeSearch={searchUser}
              onClearSearch={clearSearch}
            />
            <Rooms
              search={search}
              collection={collection}
              roomSelected={roomSelected}
              onSelectRoom={selectRoom}
              onJoinUserToRoom={joinUserRoom}
            />
          </aside>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user, room, search }) => ({
  me: user?.me,
  roomSearch: room?.search,
  collection: room?.collection,
  search: search?.collection,
  roomSelected: room?.selected,
});

const mapDispatchToProps = {
  searchUser,
  selectRoom,
  joinUserRoom,
  clearSearch,
  drawerShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
