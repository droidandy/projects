/**
 * Created by developercomputer on 26.01.16.
 */
import React, { Component } from "react";


export default class ZoomControl extends Component {

  render() {
    const { zoomIn, zoomOut } = this.props;
    return (
      <div className="zoom-control">
        <div className="zoom-in" onClick={zoomIn} />
        <div className="zoom-out" onClick={zoomOut} />
      </div>
    );
  }

}