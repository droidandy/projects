/**
 * Created by developercomputer on 11.12.15.
 */
import React from "react"

class NavTitle extends React.Component {
  render() {
    return (
        <div className={`center ${this.props.mode}`}>{this.props.children}</div>
    );
  }
}

export default NavTitle;
