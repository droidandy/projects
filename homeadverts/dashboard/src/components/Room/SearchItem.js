import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from '@material-ui/core';
import { UserDetails } from 'components';

export default class SearchItem extends Component {
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
  };

  get data() {
    const { data } = this.props;
    return { ...data, title: data?.name, subTitle: data?.company };
  }

  handleClick = () => {
    const { onClick, data } = this.props;
    onClick(data);
  };

  renderContent = () => <UserDetails data={this.data} />;

  render() {
    return (
      <ListItem
        button
        className="room"
        onClick={this.handleClick}
      >
        {this.renderContent()}
      </ListItem>
    );
  }
}
