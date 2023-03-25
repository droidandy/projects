import React, { Component } from "react";

import * as Validator from "@Core/utils/validators";
import { translate } from "@Core/i18n";

import "./index.scss";
import Error from "@Components/Structure/Error";

import actionSubmitEmailToMailchimp from "./actions/actionSubmitEmailToMailchimp";

@translate(
  {
    waitingList: {
      header: "Запишитесь в лист ожидания",
      sent: {
        header: "Спасибо за подписку на лист ожидания",
        text: "Вы узнаете первыми о появлении продукта",
      },
      noStringsAttached:
        "Подписка не обязывает к покупке<br />Вы можете отписаться в любое время",
    },
    email: "Введите ваш емейл",
    errorEmail: "Введите валидный емейл",
    button: "подписаться",
  },
  "EmailSubscribe"
)
export default class ProductEmailSubscribe extends React.Component {
  state = {
    isSent: this.props.isSent,
    email: this.props.email,
    isEmailError: !Validator.isValidEmail(this.props.email),
  };

  handleChange = (email) => {
    const newEmail = email && typeof email === "string" ? email.toLowerCase().trim() : email;
    this.checkEmail(newEmail);
    this.setState({ email: newEmail });
  };

  checkEmail = (email) => {
    const isEmailError = !Validator.isValidEmail(email);
    this.setState({ isEmailError });

    if (!isEmailError) this.setState({ email });

    return isEmailError;
  };

  renderSent() {
    return (
      <div className="sent text-center" id="mce-success-response">
        <h2>{this.t("waitingList.sent.header")}</h2>
        <div className="mb-3">
          {this.t("waitingList.sent.text", {
            product: this.props.productTitle
          })}
        </div>
        <div className="sentIcon" />
      </div>
    );
  }

  onFormSubmit(e) {
    e.preventDefault();
    if (!this.state.email || this.state.isSent || this.state.isEmailError)
      return false;

    const onSubmitSuccess = () => {
      this.setState({ isSent: true });
    };

    this.props.actionOnSubmit(
      this.props.signUpLocation,
      this.state.email,
      onSubmitSuccess.bind(this)
    );
  }

  isReadyToSend() {
    return;
  }

  renderForm() {
    return (
      <form onSubmit={this.onFormSubmit.bind(this)}>
        <h2>{this.t("waitingList.header")}</h2>
        <div className="mb-4">{this.props.promoText}</div>
        <div className="row">
          <div className="col-12">
            <label>
              <div
                hidden={!this.state.email || !this.state.isEmailError}
                className="invalid-error"
              >
                <i className="fa fa-exclamation-triangle"></i>{" "}
                {this.t("errorEmail")}
              </div>

              <input
                placeholder={this.t("email")}
                type="text"
                name="EMAIL"
                id="mc-EMAIL"
                defaultValue={this.state.email}
                className="dd_479331_223053"
                autoFocus
                autoComplete="email"
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => this.checkEmail(e.target.value)}
                onBlur={(e) => this.handleChange(e.target.value)}
              />
            </label>
          </div>
          <div className="col-12">
            <button
              disabled={!(this.state.email && !this.state.isEmailError)}
              type="submit"
              name="subscribe"
              className="btn"
            >
              {this.t("button")}
            </button>
          </div>
        </div>

        <div
          hidden
          id="mergeRow-gdpr"
          className="mergeRow gdpr-mergeRow content__gdprBlock mc-field-group"
        >
          <div className="content__gdpr">
            <label>Marketing Permissions</label>
            <p>
              Please select all the ways you would like to hear from Cream.ly:
            </p>
            <fieldset
              className="mc_fieldset gdprRequired mc-field-group"
              name="interestgroup_field"
            >
              <label className="checkbox subfield" htmlFor="gdpr_14835">
                <input
                  type="checkbox"
                  defaultChecked
                  id="gdpr_14835"
                  name="gdpr[14835]"
                  value="Y"
                  className="av-checkbox "
                />
                Email
              </label>
            </fieldset>
            <p>
              You can unsubscribe at any time by clicking the link in the footer
              of our emails. For information about our privacy practices, please
              visit our website.
            </p>
          </div>
          <div className="content__gdprLegal">
            <p>
              We use Mailchimp as our marketing platform. By clicking below to
              subscribe, you acknowledge that your information will be
              transferred to Mailchimp for processing.{" "}
              <a href="https://mailchimp.com/legal/" target="_blank">
                Learn more about Mailchimp's privacy practices here.
              </a>
            </p>
          </div>
        </div>
        {/*
 <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
*/}
        <div aria-hidden="true">
          <input
            type="hidden"
            name="b_9bd8387e41af50a27ad877924_4b8c1ecdec"
            tabIndex="-1"
            value=""
          />
        </div>

        <div
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: this.t("waitingList.noStringsAttached"),
          }}
        ></div>
      </form>
    );
  }

  render() {
    return (
      <div className="ProductEmailSubscribe">
        {this.state.isSent ? this.renderSent() : this.renderForm()}
      </div>
    );
  }
}

ProductEmailSubscribe.defaultProps = {
  actionOnSubmit: actionSubmitEmailToMailchimp,
  productTitle: "",
};
