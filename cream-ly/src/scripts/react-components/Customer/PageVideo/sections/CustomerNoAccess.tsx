//@ts-nocheck
import React, { Component } from "react";
import PropTypes from "prop-types";

import { translate } from "@Core/i18n";
import VimeoVideo from "@Components/SharedComponents/VimeoVideo";
import Header from "@Components/Structure/Header";

import ProductFeedbacks from "@Components/SharedComponents/ProductFeedbacks";

import BuyButton from "./BuyButton";

@translate(
  { noAccessNotification: "У вас нет полного доступа к данному видео" },
  "PageCustomerVideo"
)
export default class CustomerNoAccess extends Component {
 
  render() {
    const { customer } = this.props;

    return (
      <>
        <p className="text-center mb-5">
          {this.t("loggedInAs", {name:customer.name, email:customer.email})} <br/>
          {this.t("noAccessNotification")}
        </p>

        <Header text={this.t(`purchaseSuggestion`)} sub={true} />
        <BuyButton
          id={this.props.video.variantId}
          price={this.props.video.price}
          lang={this.props.lang}
        />

        <div className="demoVideo">
          <Header text={this.t("demoVideo")+" "+this.props.video.translation.title} sub={true} />
          <VimeoVideo vimeoId={this.props.video.demoVimeo.videoId} />
        </div>
        
        <ProductFeedbacks
          lang={this.props.lang}
          product={{title:this.props.video.translation.title}}
          feedbacks={this.props.video.translation.feedbacks}
        />
      </>
    );
  }
}

CustomerNoAccess.propTypes = {
  videoHandle: PropTypes.string,
  product: PropTypes.object,
  customer: PropTypes.object,
  productVariant: PropTypes.object,
  demoVimeoId: PropTypes.number,
};
