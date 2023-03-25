/**
 * Created by developercomputer on 28.01.16.
 */
import React, { Component } from "react";


export default class Button extends Component {

  static defaultProps = {
    onClick: () => {},
    classList: []
  };

  render() {
    const { onClick, classList, children } = this.props;
    return (
        <a
            href="#"
            className={classList.join(" ")}
            onClick={onClick}>
          {children}
        </a>
    );
  }
}
