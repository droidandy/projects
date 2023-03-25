/**
 * Created by developercomputer on 11.12.15.
 */
import React from "react"

export default class View extends React.Component {
  render() {
    return (
        <div className={`view ${this.props.viewName}`}>{this.props.children}</div>
    );
  }
};

