/**
 * Created by developercomputer on 08.01.16.
 */
import React, { Component } from "react";

class Region extends Component {
  render() {
    const { children } = this.props;
    return (
        <div className="regionsList-el_inside">
          {children}
        </div>
    );
  }
}

export default Region;
