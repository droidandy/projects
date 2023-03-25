//@ts-nocheck
import React, { Component } from "react";
import PropTypes from "prop-types";
import InstagramFeed from "@Components/SharedComponents/InstagramFeed";
import VideoPlayer from "./VideoPlayer";
import { translate } from "@Core/i18n";

//@ts-nocheck
@translate({}, "PageCustomerVideo")
export default class CustomerWithAccess extends Component {
  render() {
    const videoHandle = this.props.video.handle;
    const videoPartsNamesList = this.props.video.translation.videoParts;
    const videoPartsTimingsList = this.props.video.translation
      .videoPartsTimingsList;

    return (
      <>
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: this.props.video.translation.shortDescription,
          }}
        />
        <VideoPlayer
          lang={this.props.lang}
          handle={videoHandle}
          vimeoList={getVimeoList(videoHandle)}
          selectedVideoPartNumber={this.props.selectedVideoPartNumber}
          videoPartsNamesList={videoPartsNamesList}
          videoPartsTimingsList={videoPartsTimingsList}
        />
        <InstagramFeed />
      </>
    );
  }
}

export const getVimeoList = (videoHandle) => {
  if (videoHandle === "video-1") {
    return ["358499227", "358500755", "358499230"];
  } else if (videoHandle === "video-aging") {
    return ["420202304", "358500755", "358499230"];
  } else if (videoHandle === "video-2-limfa") {
    return ["366841662", "366841672", "366841676"];
  } else if (videoHandle === "video-3-osanka") {
    return ["373974293", "373974288"];
  } else if (videoHandle === "video-4-buccal-massage") {
    return ["385671145", "385671149", "385671154", "387138409"];
  } else if (videoHandle === "video-5-guasha-massage") {
    return ["393111259", "393111260", "393111263"];
  } else if (videoHandle === "video-6-cellulite") {
    return ["411026027", "411028427", "411030361"];
  } else if (videoHandle === "video-7-mewing") {
    return ["441605180", "441607786", "441607966"];
  } else if (videoHandle === "video-8-taping") {
    return ["505303844", "505304315", "505304351", "505304328", "505304301"];
  } else if (videoHandle === "video-9-body-taping") {
    return [
      "558209877",
      "558199036",
      "558200128",
      "558200548",
      "558202188",
      "558203541",
      "558205577",
      "558205905",
      "558206855",
      "558207210",
      "558207804",
    ];
  }
};

CustomerWithAccess.propTypes = {
  video: PropTypes.object,
};
