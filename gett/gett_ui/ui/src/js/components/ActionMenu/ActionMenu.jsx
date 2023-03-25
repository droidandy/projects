import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import noop from 'lodash/noop';
const emptyArr = [];

export default class ActionMenu extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <Menu { ...rest } selectedKeys={ emptyArr }>
        { React.Children.map(children, (item) => {
          if (!item) return;

          const { onClick, disabled, children } = item.props;
          return onClick
            ? React.cloneElement(item, { onClick: undefined }, <div onClick={ disabled ? noop : onClick }>{ children }</div>)
            : item;
        }) }
      </Menu>
    );
  }
}

ActionMenu.Item = Menu.Item;
