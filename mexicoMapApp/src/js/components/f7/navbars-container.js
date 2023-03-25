/**
 * Created by developercomputer on 11.12.15.
 */
import React from "react"

export default class NavBarsContainer extends React.Component {
  render() {
    return (
        <div className="navbar">{this.props.children}</div>
    );
  }
};
