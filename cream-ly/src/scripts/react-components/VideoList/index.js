import React from "react";
import { connect } from "@Components/index";

import "./index.scss";

import Card from "./Card";
import { translate } from "@Core/i18n";

const mapStoreToProps = (state, ownProps) => {
  return {
    videos: ownProps.videos ? ownProps.videos : state.products.videos,
    purchasedVideosHandles: ownProps.purchasedVideosHandles
      ? ownProps.purchasedVideosHandles
      : state.customer.videos,
  };
};
@translate({}, "common")
class VideoList extends React.Component {
  isPurchased(video) {
    return this.props.purchasedVideosHandles.includes(video.handle);
  }
  render() {
    const { videos, lang, columnSize } = this.props;

    const colSize = columnSize || "col";

    return (
      <div className="componentVideo">
        <div className="row justify-content-center no-gutters">
          {videos.map((video, index) => {
            return (
              <div key={index} className={`${colSize}`}>
                <Card
                  isPurchased={
                    this.props.isVisiblePurchasedBadge &&
                    this.isPurchased(video)
                  }
                  lang={lang}
                  hideFreeBadge={this.props.hideFreeBadge}
                  video={video}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

VideoList.defaultProps = {
  lang: "ru",
  hideFreeBadge: false,
  isVisiblePurchasedBadge: false,
  purchasedVideosHandles: [],
};
export default connect(mapStoreToProps)(VideoList);
