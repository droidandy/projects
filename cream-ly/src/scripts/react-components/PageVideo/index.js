import React from "react";
import "./index.scss";

import MessageUs from "@Components/SharedComponents/MessageUs";
import VideoList from "../VideoList";
// import ConsultationPromo from "@Components/SharedComponents/ConsultationPromo";

import Header from "@Components/Structure/Header";

import EmailForm from "@Components/EmailSubscription/ProductSubscribe";

import VideoTitle from "./sections/VideoTitle";
import VideoParts from "./sections/VideoParts";

import VimeoVideo from "@Components/SharedComponents/VimeoVideo";

import Feedbacks from "./sections/Feedbacks";
import { translate } from "@Core/i18n";
import { connect } from "@Components/index";

const mapStateToProps = (state, ownProps) => {
  const videos = ownProps.videos ? ownProps.videos : state.products.videos;
  return {
    videos,
    video: videos.find((video) => video.handle === ownProps.handle),
    recommendedVideosHandles: ownProps.recommendedVideosHandles
      ? ownProps.recommendedVideosHandles
      : state.quiz.videos,

    purchasedVideosHandles: ownProps.purchasedVideosHandles
      ? ownProps.purchasedVideosHandles
      : state.customer.videos,
  };
};

@translate(
  {
    otherVideos: "Другие Мастер-классы и Видео курсы",
    recommendedVideos: "Рекомендованные вам",
    feedbacksType: "ВИДЕО-КУРС",
    masterType: "мастер-класс",
    videoPartsIntro: "Содержание видео курса",
  },
  "PageVideoDetails"
)
class PageVideoDetails extends React.Component {
  getRecommendedVideosList() {
    if (!this.props.recommendedVideosHandles) return [];
    const currentVideoHandle = this.props.video.handle;

    return this.props.videos.filter((video) =>
      this.props.recommendedVideosHandles.some(
        (handle) => handle === video.handle && handle !== currentVideoHandle
      )
    );
  }

  getOtherVideosList() {
    const currentVideoHandle = this.props.video.handle;

    let list = this.props.videos
      .filter((video) => currentVideoHandle !== video.handle)
      .filter((video) => !this.getRecommendedVideosList().includes(video));

    return list;
  }

  render() {
    const recomendedVideos = this.getRecommendedVideosList();
    const title = this.props.video.translation.title;
    const feedbacks = this.props.video.translation.feedbacks;
    const price = this.props.video.price;

    return (
      <div className="componentPageVideo">
        <div className="sectionMainVideo">
          <div className="videoBackground" />
          <div className="videoContent">
            <div className="row">
              {!this.props.video.isNotReady &&
                this.props.video.demoVimeo.videoId > 0 && (
                  <div className="col-lg-8 col-12">
                    <VimeoVideo vimeoId={this.props.video.demoVimeo.videoId} />
                  </div>
                )}
              <div className="col-lg-4 col-12">
                <VideoTitle
                  lang={this.props.lang}
                  isNotReady={this.props.video.isNotReady}
                  variantId={this.props.video.variantId}
                  type={
                    this.props.video.type == "master"
                      ? this.t("common:master")
                      : this.t("common:videoCourse")
                  }
                  title={title}
                  handle={this.props.handle}
                  price={price}
                  discountUntil={this.props.video.discountUntil}
                  pageURL={this.props.video.pageURL}
                  isPurchased={this.props.purchasedVideosHandles.includes(
                    this.props.handle
                  )}
                />
              </div>
              {this.props.video.isNotReady && (
                <div className="col-lg-8 col-12 text-center emailForm">
                  <EmailForm
                    signUpLocation={this.props.video.handle}
                    promoText={
                      "Получите доступ к видео-курсу " +
                      this.props.video.translation.title +
                      " первыми и со скидкой 30%"
                    }
                    lang={this.props.lang}
                  />
                </div>
              )}

              {this.props.isNotReady && "подписаться"}
            </div>
          </div>
        </div>
        <div className="sectionVideoRows">
          <div className="row">
            <div className="col-lg-8 col-12">
              <div
                className="videoDescription"
                dangerouslySetInnerHTML={{
                  __html: this.props.video.translation.description,
                }}
              ></div>
              {this.props.video.translation.additionalDetails && (
                <div
                  className="videoDescription additionalDetails"
                  dangerouslySetInnerHTML={{
                    __html: this.props.video.translation.additionalDetails,
                  }}
                ></div>
              )}

              {this.props.handle == "video-8-taping" && (
                <VideoParts
                  videoParts={this.props.video.translation.videoParts}
                  translate={this.translate}
                  lang={this.props.lang}
                />
              )}

              {Array.isArray(feedbacks) && feedbacks.length > 0 && (
                <Feedbacks
                  list={feedbacks}
                  title={`${this.t("common:videoCourse")} ${title}`}
                />
              )}
            </div>
            <div className="col-lg-4 col-12">
              <div className="videoGallery">
                {!!recomendedVideos.length && (
                  <div data-test="recommended-video-block">
                    <Header text={this.i18n.recommendedVideos} />
                    <VideoList
                      videos={recomendedVideos}
                      isVisiblePurchasedBadge={true}
                      purchasedVideosHandles={this.props.purchasedVideosHandles}
                    />
                  </div>
                )}
                <>
                  <Header text={this.i18n.otherVideos} />
                  <VideoList
                    videos={this.getOtherVideosList()}
                    isVisiblePurchasedBadge={true}
                    purchasedVideosHandles={this.props.purchasedVideosHandles}
                  />
                </>
              </div>
            </div>
          </div>
        </div>

        <MessageUs lang={this.props.lang} />
      </div>
    );
  }
}
PageVideoDetails.defaultProps = {
  lang: "ru",
  purchasedVideosHandles: [],
  recommendedVideosHandles: [],
};

export default connect(mapStateToProps)(PageVideoDetails);
