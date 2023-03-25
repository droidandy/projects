// @ts-nocheck

import React from "react";
import { connect } from "@Components/index";

import PromoAdvantages from "@Components/SharedComponents/PromoAdvantages";
import InstagramFeedback from "@Components/SharedComponents/InstagramFeedback";
import MessageUs from "@Components/SharedComponents/MessageUs";

import PromoMain from "./sections/PromoMain";
import HomeFreeVideo from "./sections/HomeFreeVideo";

import "./index.scss";

class PageHomePage extends React.Component {
  isFreeVideoPromoVisible() {
    if (!this.props.customer || !Array.isArray(this.props.customer.videos))
      return true;

    const videos = this.props.customer.videos;
    const isVideoShow =
      !videos ||
      (Array.isArray(videos) &&
        videos.every((handle) => handle !== "video-aging"));

    return isVideoShow;
  }

  render() {
    return (
      <div className="PageHomePage">
        <PromoMain
          variant="variant2022jan"
          lang={this.props.lang}
          isQuizReady={this.props.isQuizReady}
        />
        <div className="maxWidthPage">
          {this.props.fulfillmentCode != "NL" &&
            ["ru", "dev"].includes(this.props.lang) &&
            this.isFreeVideoPromoVisible() && (
              <HomeFreeVideo lang={this.props.lang} />
            )}
          <PromoAdvantages lang={this.props.lang} />
          <div className="spacingBottom"></div>
          <InstagramFeedback lang={this.props.lang} />
          <MessageUs lang={this.props.lang} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    customer: ownProps.customer ? ownProps.customer : state.customer,
    fulfillmentCode: ownProps.fulfillmentCode
      ? ownProps.fulfillmentCode
      : state.app.localizationSettings.fulfillmentCode,

    isQuizReady: ownProps.isQuizReady
      ? ownProps.isQuizReady
      : state.quiz.isReady,
  };
};

export default connect(mapStateToProps)(PageHomePage);
