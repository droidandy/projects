import { translate } from "@Core/i18n";
import React, { Component } from "react";
import Thumbnail from "../VideoThumbnail";
import Badge from "@Components/Structure/Badge";

import "./card.scss";

@translate({}, "common")
class card extends Component {
  render() {
    const video = this.props;
    return (
      <div className="componentVideosGroupCard row no-gutters">
        <div className="col colThumbnail">
          <Thumbnail vimeoId={video.demoVimeo.imageId} url={video.url} />
        </div>
        <div className="col">
          <div className="type">
            <a href={video.url}>
              {video.type
                ? this.t("common:master")
                : this.t("common:videoCourse")}
            </a>
          </div>
          <div className="title">
            <a href={video.url}> {video.title}</a>
          </div>
          {video.isPurchased && (
            <div className="badge" data-test="purchased-video-badge">
              <Badge purchased />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default card;
