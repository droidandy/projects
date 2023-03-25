import React from "react";
import "./index.scss";

import Card from "./card";
import { translate } from "@Core/i18n";

@translate({}, "common")
class VideosGroup extends React.Component {
  render() {
    return (
      <div className="componentSummaryVideos">
        {this.props.videos.map((video, index) => (
          <div
            key={index}
            className={`row video no-gutters ${
              video.isSelected ? null : "notSelected"
            }`}
          >
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
