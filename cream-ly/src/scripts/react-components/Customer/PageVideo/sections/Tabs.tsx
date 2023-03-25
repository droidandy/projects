//@ts-nocheck
import React, { Component } from "react";
import { translate } from "@Core/i18n";
import PropTypes from "prop-types";

@translate({})
export default class Tabs extends Component {
  handleClick(e, handle) {
    e.preventDefault();
    this.props.handleClickTab(handle);
  }

  render() {
    return (
      <ul className="nav nav-tabs">
        {this.props.videos.map((video, index) => (
          <li key={index} className="nav-item" hidden={video.isNotReady}>
            <a
              className={`nav-link ${video.handle} ${this.props.selectedVideoHandle === video.handle &&
                "active"}`}
              onClick={(e) => this.handleClick(e, video.handle)}
              href={`#${video.handle}`}
            >
              {video.translation.shortTitle}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

Tabs.propTypes = {
  videos: PropTypes.array,
  handleClickTab: PropTypes.func,
  selectedVideoHandle: PropTypes.string,
};
