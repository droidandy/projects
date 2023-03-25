/**
 * Created by developercomputer on 04.01.16.
 */
import React, { Component } from "react";

import menuElements from "./menu-items.js";



class MenuItem extends Component {

  render() {
    const { href, children, theme } = this.props;

    return (
        <a
            className={`item ${theme}`}
            href={href}>
          <div></div>
          <div>{children}</div>
        </a>
    );
  }
}

class Menu extends Component {

  constructor(props) {
    super(props);
    this._renderMenuItems = this._renderMenuItems.bind(this);
  }

  _renderMenuItems() {
    return this.props.menuItems.map((item, i) => {
      return (
        <MenuItem
            theme={item.theme}
            href={item.link}
            key={i}>
          {item.name}
        </MenuItem>
      );
    })
  }

  render() {
    return (
        <div className="menu">
          <div className="wrapper">
            {this._renderMenuItems()}
          </div>
        </div>
    );
  }
}

export default Menu;
