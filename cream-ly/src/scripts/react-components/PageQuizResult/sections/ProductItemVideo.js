import React from "react";
import "./ProductItemVideo.scss";

import Thumbnail from "@Components/VideoThumbnail/";
import Price from "@Components/Price";
import { translate } from "@Core/i18n";
import i18next from "i18next";
import Badge from "@Components/Structure/Badge";

@translate({}, "common")
export default class VideoCard extends React.Component {
  render() {
    const labelId = "checkbox_" + this.props.product.sku;

    return (
      <div
        className="ProductItemVideo ComponentProductItemVideo"
        id={"product_" + this.props.video.sku}
      >
        {this.props.number > 0 && (
          <div className="number">{this.props.number}</div>
        )}
        <Thumbnail
          icon={true}
          vimeoId={
            this.props.video.demoVimeo
              ? this.props.video.demoVimeo.imageId
              : null
          }
          onClick={(e) => {
            e.preventDefault();
            this.props.handleClick();
          }}
        />
        <div className="groupDescription">
          <label
            className="checkbox-custom"
            hidden={this.props.product.isOutOfStock}
          >
            <input
              id={labelId}
              className="item_checkbox"
              type="checkbox"
              defaultChecked={this.props.isSelected}
              onChange={() => this.props.handleSelect(this.props.product.sku)}
            />
            <span></span>
          </label>

          <div className="title">
            <label htmlFor={labelId}>
              <a>{this.props.video.translation.title}</a>
            </label>
          </div>
          <div className="type">
            {this.props.video.type === "master"
              ? i18next.t("common:master")
              : i18next.t("common:videoCourse")}{" "}
            | <Price price={this.props.product.price} />
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
