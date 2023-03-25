import React, { Component } from "react";

import "./index.scss";
import Header from "@Components/Structure/Header";
import Button from "@Components/Structure/Button";

import { translate } from "@Core/i18n";
import { connect } from "@Components/index";

export const COMPONENT_NAME = "GuestPromoForm";

@translate(
  {
    header: "Поделитесь скидкой на @CREAM.LY",
    intro:
      "Как только ваш друг совершит свою первую покупку @CREAM.LY по вашей персональной реферальной ссылке, вы получите скидку 10%  на ваш следующий заказ.",
    terms: "",

    subscribeLabel: "Подписаться на рассылку",
    button: "Получить ссылку",
    name: "Ваше Имя",
    email: "Ваш Имэйл",

    error: "Please enter your name and a valid email address.",
    errorUnkonwn:
      "An error has occured. Please contact the administrator of this site for more information.",
  },
  "Referrals"
)
class ReferralPromoShort extends Component {
  render() {
    return (
      <div id="conjured_advocate_signup" className="ComponentPageReferAFriend">
        <div className="row">
          <div className="col-lg-6 col-md-12 text-center form">
            <Header text={this.t("header")} />
            <div
              class="intro template_advocate_signup_subheading"
              dangerouslySetInnerHTML={{ __html: this.t("intro") }}
            ></div>
            <div
              id="conjured_save_advocate_error"
              class="conjured_error"
              data-invalid-input={this.t("error")}
              data-unknown-error={this.t("errorUnknown")}
            ></div>
            <div>
              <input
                id="conjured_referral_name"
                name="name"
                type="text"
                defaultValue={this.props.name}
                placeholder={this.t("name")}
                autocomplete="name"
              />
            </div>

            <div>
              <input
                id="conjured_referral_email"
                name="email"
                type="email"
                defaultValue={this.props.name}
                placeholder={this.t("email")}
                autocomplete="email"
              />
            </div>

            <div hidden class="template_advocate_signup_show_newsletter">
              <input
                id="conjured_accepts_marketing"
                checked="checked"
                name="accepts_marketing"
                type="checkbox"
                value="1"
              />
              <label for="conjured_accepts_marketing">
                {this.t("subscribeLabel")}
              </label>
            </div>

            <button
              id="conjured_save_advocate"
              class="btn button template_advocate_signup_button"
            >
              {this.t("button")}
            </button>

            <div
              class="terms"
              dangerouslySetInnerHTML={{ __html: this.t("terms") }}
            ></div>
          </div>
          <div class="col-lg-6 col-md-12  image"></div>
        </div>
      </div>
    );
  }
}

export default connect()(PageReferAFriend);
