//@ts-nocheck
import React, { Component } from "react";
import { translate } from "@Core/i18n";

import LoginStatus from "../../LogInStatus";
import BuyButton from "./BuyButton";

@translate(
  { purchaseSuggestion: "Желаете получить персональный доступ?" },
  "PageCustomerVideo"
)
export default class GuestView extends Component {
  render = () => {
    return (
      <>
        <LoginStatus lang={this.props.lang} />
        <div className="text-center p-3" style={{ marginTop: 50 }}>
          {this.t("purchaseSuggestion")}
        </div>
        <BuyButton
          lang={this.props.lang}
          id={this.props.video.variantId}
          price={this.props.video.price}
        />
      </>
    );
  };
}
