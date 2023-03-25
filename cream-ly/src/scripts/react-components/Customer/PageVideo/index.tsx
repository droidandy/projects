//@ts-nocheck
import React, { Component } from "react";
//import StateShape from "@reduxShape"

import Header from "@Components/Structure/Header";

// import ConsultationPromo from "@Components/SharedComponents/ConsultationPromo";
import Tabs from "./sections/Tabs";
import GuestView from "./sections/GuestView";
import CustomerNoAccess from "./sections/CustomerNoAccess";
import CustomerWithAccess from "./sections/CustomerWithAccess";

import "./index.scss";
import { translate } from "@Core/i18n";
import { connect } from "@Components/index";;

export const getFixedJson = (json) => {
  if (typeof json != "string" || typeof json.replaceAll != "function") return json;

  return json
    .trim()
    .replaceAll("\n", "")
    .replaceAll("\r", "")
    .replaceAll("↵", "")
    .replaceAll("“", '"')
    .replaceAll("”", '"');
}

@translate({}, "PageCustomerVideo")
class CustomerPageVideo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedVideoPartNumber: this.props.selectedVideoPartNumber,
      video: this.getVideoByHandle(this.props.selectedVideoHandle)
    };
  }

  getVideoByHandle = (videoHandle) => {
    const videos = this.props.videos.filter((video) => video.handle == videoHandle)
    if (videos.length == 0) return this.props.videos[0]

    return videos.shift()
  }

  handleClickTab = (videoHandle) => {
    this.setState({
      video: this.getVideoByHandle(videoHandle),
      selectedVideoPartNumber: 0,
    });
  };

  renderIfCustomer() {
    const hasAccess = this.props.customer && Array.isArray(this.props.customer.videos) && this.props.customer.videos.filter(videoHandle => videoHandle == this.state.video.handle).length > 0;

    return (
      <>
        {hasAccess ? (
          <CustomerWithAccess
            lang={this.props.lang}
            video={this.state.video}
            selectedVideoPartNumber={this.state.selectedVideoPartNumber}
          />
        ) : (
          <CustomerNoAccess
            lang={this.props.lang}
            video={this.state.video}
            customer={this.props.customer}
          />
        )}
      </>
    );
  }

  renderIfEn() {
    return <p className="text-center">
      Sorry, videos are only available in Russian for now, we are working on translations<br />
      <a href="/pages/video?lang=ru">Switch to Russian language / Переключиться на русский</a>
    </p>
  }

  render() {
    const { customer } = this.props;

    return (
      <div className="CustomerPageVideo">
        <Header
          isPageHeader
          text={`${this.state.video.handle === "video-aging"
            ? this.t(`common:master`)
            : this.t(`common:videoCourse`)
            } ${this.state.video.translation.title}`}
        />

        {(this.props.lang == "en" || this.props.lang == "lv") && this.renderIfEn()}

        {this.props.lang == "ru" && (
          <React.Fragment>
            <Tabs
              lang={this.props.lang}
              videos={this.props.videos}
              selectedVideoHandle={this.state.video.handle}
              handleClickTab={this.handleClickTab}
            />
            <div className="content">
              {!!customer.id && this.renderIfCustomer()}
              {!customer.id && (
                <GuestView
                  video={this.state.video}
                  customer={this.props.customer}
                />
              )}

              {/* <ConsultationPromo lang={this.props.lang} handleClick={this.props.handleClickMore} /> */}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  //console.log("ownProps",ownProps)

  const stateHandle = state.app.route.hash
    ? state.app.route.hash.replace("#", "").replace("/", "")
    : undefined;

  return {
    videos: ownProps.videos ? ownProps.videos : state.products.videos,
    customer: ownProps.customer ? ownProps.customer : state.customer,
    selectedVideoHandle: ownProps.selectedVideoHandle ? ownProps.selectedVideoHandle : stateHandle
  }
};
export default connect(mapStateToProps)(CustomerPageVideo);
