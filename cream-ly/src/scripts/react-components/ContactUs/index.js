import React, { Component } from "react";
import { connect } from "@Components/index";

import * as Validator from "@Core/utils/validators";
import { translate } from "@Core/i18n";
import Error from "@Components/Structure/Error";
import Header from "@Components/Structure/Header";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";
import MessageUs from "@Components/SharedComponents/MessageUs";

import actionOnSubmit from "./actions/actionOnSubmit";

import "./index.scss";

@translate(
  {
    title: "НАПИСАТЬ В CREAM.LY",
    contactName: "Имя",
    email: "Имейл",
    phoneNumber: "Телефон",
    message: "Сообщение",
    buttonSend: "Отправить",
    success: "Спасибо что связались с нами. Мы ответим как только сможем.",
    errors: {
      invalidEmail: "$t(Login:errors.invalidEmail)",
      emptyContactName: "Введите ваше Имя",
      emptyMessage: "Введите Сообщение",
    },
  },
  "PageContactUs"
)
class PageContactUs extends Component {
  state = {
    email: this.props.email,
    name: this.props.name,
    phone: this.props.phone,
    message: this.props.message,
    isLoading: this.props.isLoading,
    isSent: this.props.isSent,
    errors: this.props.errors,
  };

  refTop = React.createRef();

  handleChange = (field, e) => {
    if (this.getError(field)) {
      this.isValidForm();
    }
    this.removeError("global");

    if (field === "email") {
      this.setState({
        [field]: e.target.value.toLowerCase().trim(),
      });
    } else {
      this.setState({
        [field]: e.target.value,
      });
    }
  };

  setError = (type, text) => {
    setTimeout(() => {
      this.setState({
        errors: [
          ...this.state.errors.filter((error) => error.type !== type),
          {
            type,
            text,
          },
        ],
      });
    }, 0);
  };

  removeError = (type) => {
    setTimeout(() => {
      this.setState({
        errors: [...this.state.errors.filter((error) => error.type !== type)],
      });
    }, 0);
  };

  getError = (type) => {
    const errors = this.state.errors
      .filter((error) => error.type === type)
      .map((error) => error.text);

    return errors.length ? errors.join(", ") : null;
  };

  isValidForm = (type = null) => {
    const { email, phone, name, message } = this.state;
    const isEmailError = !Validator.isValidEmail(email);
    // const isPhoneError = !phone;
    const isNameError = !name;
    const isMessageError = !message;

    if ((type === "message" && isMessageError) || (!type && isMessageError)) {
      this.setError("message", this.t("errors.emptyMessage"));
    } else if (
      (type === "message" && !isMessageError) ||
      (!type && !isMessageError)
    ) {
      this.removeError("message");
    }

    if ((type === "name" && isNameError) || (!type && isNameError)) {
      this.setError("name", this.t("errors.emptyContactName"));
    } else if ((type === "name" && !isNameError) || (!type && !isNameError)) {
      this.removeError("name");
    }

    if ((type === "email" && isEmailError) || (!type && isEmailError)) {
      this.setError("email", this.t("errors.invalidEmail"));
    } else if (
      (type === "email" && !isEmailError) ||
      (!type && !isEmailError)
    ) {
      this.removeError("email");
    }

    // if ((type === "phone" && isPhoneError) || (!type && isPhoneError)) {
    //   this.setError("phone", this.t("errors.invalidPhoneNumber"));
    // } else if (
    //   (type === "phone" && !isPhoneError) ||
    //   (!type && !isPhoneError)
    // ) {
    //   this.removeError("phone");
    // }

    return !isEmailError && !isNameError && !isMessageError;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.refTop.current.scrollIntoView();

    if (this.isValidForm()) {
      this.setState({
        isLoading: true,
      });
      const { email, name, phone, message } = this.state;
      this.props.actionOnSubmit({ email, name, phone, message });
    }
  };

  isError(type) {
    return !!this.state.errors.find((item) => item.type === type);
  }
  render() {
    const { email, name, phone, message } = this.state;
    return (
      <div ref={this.refTop} className="ComponentContactUs">
        <Header isPageHeader>{this.t("PageContactUs:title")}</Header>

        {this.isError("global") && <Error text={this.getError("global")} />}

        {this.state.isLoading && <LoadingIndicator />}

        {!this.state.isLoading && this.state.isSent && (
          <>
            <p className="note form-success text-center">
              {this.t("PageContactUs:success")}
            </p>
            <div className="sentIcon"></div>
          </>
        )}
        {!this.state.isLoading && !this.state.isSent && (
          <>
            <div className="contact-form form-vertical">
              <form id="contact" onSubmit={this.handleSubmit}>
                <div className="grid grid--half-gutters">
                  <div className="grid__item medium-up--one-half">
                    <label
                      className={
                        this.isError("name") ? "label--error" : undefined
                      }
                      htmlFor="ContactFormName"
                    >
                      {this.getError("name") ||
                        this.t("PageContactUs:contactName")}
                    </label>
                    <input
                      autoComplete="name"
                      defaultValue={name}
                      name="contact[name]"
                      id="ContactFormName"
                      className={
                        this.isError("name") ? "input--error" : undefined
                      }
                      onChange={(e) => this.handleChange("name", e)}
                      onBlur={() => this.isValidForm("name")}
                    />
                  </div>

                  <div className="grid__item medium-up--one-half">
                    <label
                      className={
                        this.isError("email") ? "label--error" : undefined
                      }
                      htmlFor="ContactFormEmail"
                    >
                      {this.getError("email") || this.t("PageContactUs:email")}
                    </label>
                    <input
                      defaultValue={email}
                      autoComplete="email"
                      name="contact[email]"
                      id="ContactFormEmail"
                      className={
                        this.isError("email") ? "input--error" : undefined
                      }
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => this.handleChange("email", e)}
                      onBlur={() => this.isValidForm("email")}
                    />
                  </div>
                </div>
                <label
                  className={this.isError("phone") ? "label--error" : undefined}
                  htmlFor="ContactFormPhone"
                >
                  {this.getError("phone") ||
                    this.t("PageContactUs:phoneNumber")}
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  defaultValue={phone}
                  name="contact[phone]"
                  id="ContactFormPhone"
                  className={this.isError("phone") ? "input--error" : undefined}
                  onChange={(e) => this.handleChange("phone", e)}
                  onBlur={() => this.isValidForm("phone")}
                />

                <label
                  htmlFor="ContactFormMessage"
                  className={
                    this.isError("message") ? "label--error" : undefined
                  }
                >
                  {this.getError("message") || this.t("PageContactUs:message")}
                </label>
                <textarea
                  rows="10"
                  defaultValue={message}
                  id="ContactFormMessage"
                  name="contact[body]"
                  className={
                    this.isError("message") ? "input--error" : undefined
                  }
                  onChange={(e) => this.handleChange("message", e)}
                  onBlur={() => this.isValidForm("message")}
                />

                <div style={{ textAlign: "center" }}>
                  <input
                    type="submit"
                    className="btn btn-style btn-primary"
                    value={this.t("PageContactUs:buttonSend")}
                  />
                </div>
              </form>
            </div>
            <MessageUs lang={this.props.lang} />
          </>
        )}
      </div>
    );
  }
}

PageContactUs.defaultProps = {
  errors: [],
};

const mapStateToProps = (state, ownProps) => {
  return {
    email: ownProps.email ? ownProps.email : state.customer.email,
    phone: ownProps.phone ? ownProps.phone : state.customer.phone,
    name: ownProps.name ? ownProps.name : state.customer.name,
    errors: Array.isArray(ownProps.errors) ? ownProps.errors : [],

    actionOnSubmit: ownProps.actionOnSubmit
      ? ownProps.actionOnSubmit
      : actionOnSubmit,
  };
};

export default connect(mapStateToProps)(PageContactUs);
