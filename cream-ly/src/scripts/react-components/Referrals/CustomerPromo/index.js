import React, { Component } from "react";

import "./index.scss";
import Header from "@Components/Structure/Header";
import Button from "@Components/Structure/Button";

import { translate } from "@Core/i18n";
import { connect } from "@Components/index";

export const COMPONENT_NAME = "CustomerPromo";

@translate(
  {
    header: "Поделитесь скидкой на @CREAM.LY",
    codeIntro: `Like CREAM.LY? Share your personal code with your friends and
      they'll get 10% off their first purchase. Once their order is
      processed, you’ll also receive a code for $10 off your next purchase with us.
      `,
    linkIntro: `Drop your referral link in the group chat and they'll thank you
    later.`,
  },
  "PageReferAFriend"
)
class CustomerPromo extends Component {
  getURL() {
    return "https://cream.ly/ref=" + this.props.code;
  }
  render() {
    return (
      <div className="ReferralsCustomerPromo">
        <div className="row">
          <div className="col-lg-6 col-md-12 text-center form">
            <Header text={this.t("header")} />
            <div
              className="intro"
              dangerouslySetInnerHTML={{ __html: this.t("codeIntro") }}
            ></div>
            <div className="code">{this.props.code}</div>
            <div
              className="intro"
              dangerouslySetInnerHTML={{ __html: this.t("linkIntro") }}
            ></div>
            <div className="link">
              <a>{this.getURL()}</a>
            </div>
            <div
              class="more"
              dangerouslySetInnerHTML={{ __html: this.t("showMore") }}
            ></div>
          </div>
          <div class="col-lg-6 col-md-12  image"></div>
        </div>
      </div>
    );
  }
}

export default connect((state, ownProps) => {
  return {
    code: "R_NIKOLAI.FROLOV473",
  };
})(CustomerPromo);
