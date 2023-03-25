import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { buildRoomDetailsLink } from 'service/room/room';

export default class PhotoSmall extends Component {
  static propTypes = {
    room: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  render() {
    const { room } = this.props;

    return (
      <Fragment>
        <Avatar
          component={Link}
          to={buildRoomDetailsLink(room)}
          src={room?.photo}
          style={{ width: 35, height: 35 }}
          className="user"
        />
        {room?.admin?.online && <div className="onlineStatus" />}
      </Fragment>
    );
  }
}
