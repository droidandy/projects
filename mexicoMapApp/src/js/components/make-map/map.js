/**
 * Created by developercomputer on 08.01.16.
 */
import React, { Component } from "react";

class Map extends Component {

  render() {
    const { children } = this.props;
    return (
        <div className="map">
          {children}
        </div>
    );
  }
}

export default Map;
