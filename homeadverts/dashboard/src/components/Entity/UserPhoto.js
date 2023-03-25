import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';
import route from 'config/route';
import { status } from 'helper/common';

export default class UserPhoto extends Component {
  static propTypes = {
    size: PropTypes.number,
    isOnline: PropTypes.bool,
    data: PropTypes.object.isRequired,
    type: PropTypes.oneOf([status.active, status.inactive, status.invisible]),
  };

  static defaultProps = {
    size: 46,
    isOnline: false,
    type: status.active,
  };

  get avatarProps() {
    const { data, size } = this.props;
    const src = data?.photo || `${route.URL_INDEX}${'/assets/images/logo/placeholder.png'}`;
    const style = { width: size, height: size };

    return { style, src };
  }

  get status() {
    const { data, isOnline, type } = this.props;
    return { isOnline: data?.online || isOnline, type };
  }

  render() {
    const { isOnline, type } = this.status;

    return (
      <div className="userPhoto">
        <Avatar className="avatar" {...this.avatarProps} />
        {isOnline && <div className={`status ${type}`} />}
      </div>
    );
  }
}
