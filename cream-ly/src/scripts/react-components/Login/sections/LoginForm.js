import React, { Component } from "react";

import Header from "@Components/Structure/Header";
import Button from "@Components/Structure/Button";
import { translate } from "@Core/i18n";
import PropTypes from "prop-types";

import * as Validator from "@Core/utils/validators";

@translate(
  {
    title: "ВХОД",
    email: "Имейл",
    password: "Пароль",
    buttonSignIn: "Войти",
    forgotPassword: "Забыли пароль?",
    createAccount: "Создать аккаунт",
  },
  "Login"
)
export default class LoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, returnURL } = this.props;
    const isEmailError = !Validator.isValidEmail(email);
    const isPasswordError = !password;

    this.props.checkForErrors();
    if (!isEmailError && !isPasswordError) {
      this.props.actionSubmitLoginForm({ email, password, returnURL });
    }
  };

  render() {
    const { email, password } = this.props;
    const globalErrorText = this.props.getError("global")
      ? this.t(this.props.getError("global")[0])
      : null;
    const emailError = !!(
      this.props.getError("email") || this.props.getError("global")
    );
    const passwordError = !!(
      this.props.getError("password") || this.props.getError("global")
    );

    return (
      <div id="CustomerLoginForm" className="form-vertical">
        {this.props.getError("global") && (
          <div
            className="error alert alert-danger text-center"
            dangerouslySetInnerHTML={{ __html: globalErrorText }}
          ></div>
        )}
        <form id="customer_login" onSubmit={this.handleSubmit}>
          <Header text={this.t("title")} />

          <label
            className={emailError ? "label--error" : undefined}
            htmlFor="CustomerEmail"
          >
            {this.props.getError("email") || this.t("email")}
          </label>
          <input
            type="email"
            value={email}
            name="customer[email]"
            id="CustomerEmail"
            className={emailError ? "input--error" : undefined}
            autoFocus
            autoComplete="email"
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
            onChange={(e) => this.props.handleChange("email", e)}
            onBlur={() => this.props.onBlur("email")}
          />

          <label
            className={passwordError ? "label--error" : undefined}
            htmlFor="CustomerPassword"
          >
            {this.props.getError("password") || this.t("password")}
          </label>
          <input
            type="password"
            value={password}
            name="customer[password]"
            id="CustomerPassword"
            autoComplete="current-password"
            className={passwordError ? "input--error" : undefined}
            onChange={(e) => this.props.handleChange("password", e)}
            onBlur={() => this.props.onBlur("password")}
          />

          <div className="text-center">
            <p>
              <a href="#recover" onClick={this.props.onClickForgetPassword}>
                {this.t("forgotPassword")}
              </a>
            </p>

            <input
              type="submit"
              className="btn"
              value={this.t("buttonSignIn")}
            />
            <br />
            <a
              href="#"
              id="customer_register_link"
              onClick={(e) => {
                e.preventDefault();
                this.props.actionGoToRegistration();
              }}
            >
              {this.t("createAccount")}
            </a>
          </div>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  checkForErrors: PropTypes.func,
  actionSubmitLoginForm: PropTypes.func,
  errors: PropTypes.array,
  getError: PropTypes.func,
  handleChange: PropTypes.func,
  onBlur: PropTypes.func,
  onClickForgetPassword: PropTypes.func,
  actionGoToRegistration: PropTypes.func,
};
