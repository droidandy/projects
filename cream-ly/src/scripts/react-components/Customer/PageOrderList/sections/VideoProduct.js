import React, { Component } from "react";
import Badge from "@Components/Structure/Badge";
import Button from "@Components/Structure/Button";
import Image from "@Components/SharedComponents/LazyLoadImage";
import i18next from "i18next";
import VideoThumbnail from "../../../VideoThumbnail";

import { translate } from "@Core/i18n";

@translate(
  {
    buttonGoToVideo: "Перейти к видео",
  },
  "PageOrderList"
)
class VideoProduct extends Component {
  render() {
    return (
      <div
        key={this.props.handle}
        className={`col-xl col-sm-4 col-12 item Product VideoProduct ${this.props.handle}`}
      >
        <div className="text-center product">
          {this.props.demoVimeo && (
            <div className="product-img">
              <a href={this.props.pageURL}>
                <VideoThumbnail
                  icon={true}
                  vimeoId={this.props.demoVimeo.imageId}
                  url={this.props.pageURL}
                />
              </a>
            </div>
          )}

          <div className="product-content">
            <a href={this.props.pageURL}>
              <h3>{this.props.title}</h3>
            </a>
            <div className="product-price-and-size">
              <div className="product-button">
                <a href={this.props.pageURL}>{this.t("buttonGoToVideo")}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoProduct;
