import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { MoreHoriz } from '@material-ui/icons';
import { ListItem, Popover } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { roomDateFormat } from 'helper/formats';
import { contentType } from 'helper/common';
import { buildRoomDetailsLink } from 'service/room/room';
import { UserDetails } from 'components';

export default class RoomItem extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      company: PropTypes.string,
      photo: PropTypes.string,
      lastMessage: PropTypes.object,
      newNotice: PropTypes.bool,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
  };

  static defaultProps = {
    isSelected: false,
  };

  state = {
    anchorEl: null,
  };

  get data() {
    const { data } = this.props;
    const hasProperty = [contentType.article, contentType.property].includes(data?.type);
    const baseData = hasProperty
      ? { photo: data?.photo }
      : { ...data.admin, photo: data.admin?.thumbnail?.xs };
    const subTitle = data?.lastMessage?.text || data?.company;

    return { ...baseData, title: data?.name, subTitle };
  }

  handleClick = () => {
    const { onClick, data } = this.props;
    onClick(data);
  };

  moreActions = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ anchorEl: event?.currentTarget });
  };

  handleClose = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ anchorEl: null });
  };

  renderContent = () => {
    const { data } = this.props;
    const { anchorEl } = this.state;
    const hasTimestamp = data?.lastMessage?.timestamp || data?.timestamp;
    const hasNewNotice = data?.newNotice;

    const open = Boolean(anchorEl);
    const id = open ? 'moreActionsPopover' : undefined;
    return (
      <div className="roomContent">
        <UserDetails data={this.data} />
        <div className="rightSide">
          <div className="top">
            {hasTimestamp && <span className="status"><Moment calendar={roomDateFormat} date={hasTimestamp} /></span>}
            {hasNewNotice && <div className="newNotice" />}
          </div>
          <MoreHoriz aria-describedby={id} onClick={this.moreActions} />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <div className="popover">
              The content of the Popover.
            </div>
          </Popover>
        </div>
      </div>
    );
  };

  render() {
    const { data, isSelected } = this.props;
    return (
      <ListItem
        button
        className={`room ${isSelected ? '__active' : ''}`}
        component={Link}
        to={buildRoomDetailsLink(data)}
        onClick={this.handleClick}
      >
        {this.renderContent()}
      </ListItem>
    );
  }
}
