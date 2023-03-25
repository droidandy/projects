import React from "react";
import "./Card.scss";

import Thumbnail from "../VideoThumbnail/";
import Price from "../Price";
import { translate } from "@Core/i18n";
import i18next from "i18next";
import Badge from "@Components/Structure/Badge";

@translate({}, "common")
export default class VideoCard extends React.Component {
  render() {
    return (
      <div className="ComponentVideoCard">
        <div className="number">{this.props.number}</div>
        <Thumbnail
          icon={true}
          vimeoId={
            this.props.video.demoVimeo
              ? this.props.video.demoVimeo.imageId
              : null
          }
          url={this.props.video.url}
        />
        <div className="groupDescription">
          <div className="type">
            <a href={this.props.video.url}>
              {this.props.video.type === "master"
                ? i18next.t("common:master")
                : i18next.t("common:videoCourse")}
            </a>
          </div>
          <div className="title">
            <a href={this.props.video.url}>
              {this.props.video.translation.title}
            </a>
          </div>
          {this.props.isPurchased && (
            <div data-test="purchased-video-badge">
              <Badge purchased />
            </div>
          )}

          {this.props.price == 0 && !this.props.hideFreeBadge && (
            <div className="price">
              <a href={this.props.video.url}>
                <Price price={this.props.video.price} />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
