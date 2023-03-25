import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List, Popover } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import { contentType, roomDefault } from 'helper/common';
import RoomItem from './RoomItem';
import SearchItem from './SearchItem';

export default class Rooms extends Component {
  static propTypes = {
    collection: PropTypes.array.isRequired,
    search: PropTypes.object.isRequired,
    roomSelected: PropTypes.object,
    onSelectRoom: PropTypes.func.isRequired,
    onJoinUserToRoom: PropTypes.func.isRequired,
  };

  static defaultProps = {
    roomSelected: null,
  };

  state = {
    anchorEl: null,
  };

  get collection() {
    const { collection, search } = this.props;
    const getCollection = type => collection.filter(room => room.type === type) || [];
    const types = [contentType.article, contentType.property, contentType.user];
    const [article, property, user] = types.map(getCollection);
    const profile = search.user.items || [];
    const business = search.business.items || [];
    return { article, property, user, profile, business };
  }

  get groups() {
    const { article, property, user, profile, business } = this.collection;
    const discussions = { label: 'Discussions', collection: article };
    const inquirys = { label: 'Inquirys', collection: property };
    const messages = { label: 'Messages', collection: user };
    const profiles = { label: 'Profiles', collection: profile };
    const companies = { label: 'Business', collection: business };
    return [discussions, inquirys, messages, profiles, companies];
  }

  renderRoom = (room) => {
    const { roomSelected, onSelectRoom, onJoinUserToRoom } = this.props;
    const isSelected = roomSelected.id === room.id;
    const baseProperties = { key: room.id, data: room };

    const roomItem = { Component: RoomItem, properties: { onClick: onSelectRoom, isSelected } };
    const searchItem = { Component: SearchItem, properties: { onClick: onJoinUserToRoom } };

    const rooms = { article: roomItem, property: roomItem, user: roomItem, search: searchItem };

    const { Component, properties } = rooms[room.type]?.Component
      ? rooms[room.type] : roomDefault;

    return <Component {...baseProperties} {...properties} />;
  };

  handleFilter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ anchorEl: event?.currentTarget });
  };

  handleClose = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ anchorEl: null });
  };

  renderGroup = ({ label = '', collection = [] }, index) => {
    return collection.length > 0 ? (
      <div key={label || index} className="group">
        {label && <div className="title">{label}</div>}
        {collection.map(this.renderRoom)}
      </div>
    ) : <Fragment key={label || index} />;
  };

  render() {
    const { anchorEl } = this.state;

    const open = Boolean(anchorEl);
    const id = open ? 'moreActionsPopover' : undefined;

    return (
      <div id="rooms">
        <div className="items">
          <div className="actions">
            <FilterList className="icon filter" onClick={this.handleFilter} />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={this.handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <div className="popover">
                filter
              </div>
            </Popover>
          </div>
          <List component="nav">
            {this.groups.map(this.renderGroup)}
          </List>
        </div>
      </div>
    );
  }
}
