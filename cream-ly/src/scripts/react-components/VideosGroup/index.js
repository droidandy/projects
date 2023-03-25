import React from "react";
import "./index.scss";

import Card from "./card";
import { translate } from "@Core/i18n";

const i18 = {
  ru: {
    total: "видео по цене",
    button: "Добавить в корзину",
  },
};
@translate(
  {
    total: "видео по цене",
    button: "Добавить в корзину",
  },
  "common"
)
class VideosGroup extends React.Component {
  render() {
    return (
      <div className="componentVideosGroup" data-nosnippet>
        {this.props.videos.map((video, index) => (
          <div
            key={index}
            className={`row video no-gutters ${
              video.isSelected ? null : "notSelected"
            }`}
          >
            <div className="colNumber d-flex align-items-center">
              <label className="checkbox-custom">
                <input
                  id={`checkbox_${video.sku}`}
                  id={`checkbox_1`}
                  className="item_checkbox"
                  type="checkbox"
                  checked={video.isSelected}
                  disabled={video.isPurchased}
                  onChange={() => this.props.handleSelect(video.handle)}
                />
                <span></span>
              </label>
            </div>
            <div className="col colCard">
              <Card {...video} />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

VideosGroup.defaultProps = {
  lang: "ru",
};
export default VideosGroup;
