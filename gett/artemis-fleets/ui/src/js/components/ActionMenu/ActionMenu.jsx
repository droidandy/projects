import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

const emptyArr = [];

export default class ActionMenu extends PureComponent {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <Menu { ...rest } selectedKeys={ emptyArr }>
        { React.Children.toArray(children).map((item) => {
          return item.props.onClick
            ? React.cloneElement(item, { onClick: undefined }, <div onClick={ item.props.onClick }>{ item.props.children }</div>)
            : item;
        }) }
      </Menu>
    );
  }
}

ActionMenu.Item = Menu.Item;
