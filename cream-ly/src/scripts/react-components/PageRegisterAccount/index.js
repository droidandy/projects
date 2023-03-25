import React, { Component } from "react";
import { connect } from "@Components/index";

import { translate } from "@Core/i18n";
import Header from "@Components/Structure/Header";

import LoadingIndicator from "@Components/Structure/LoadingIndicator";
import * as Validator from "@Core/utils/validators";

import actionOnSubmit from "./actions/actionOnSubmit.ts";

import "./index.scss";

const serverErrorsMapping = {
  CUSTOMER_DISABLED: "serverErrors.emailConfirmaitonRequired",
  TAKEN: "serverErrors.taken",
  TOO_SHORT: "errors.tooShort",
};

@translate({}, "PageRegisterAccount")
class PageRegisterAccount extends Component {
  state = {
    firstName: this.props.firstName || null,
    lastName: this.props.lastName || null,
    email: this.props.email,
    password: this.props.password,
    serverErrors: Array.isArray(this.props.serverErrors)
      ? this.props.serverErrors
      : [],
    errors: [],
    isLoading: this.props.isLoading,
    isComplete: this.props.isComplete,
  };

  handleChange = (field, e) => {
    if (this.getError(field)) {
      this.checkForErrors();
    }
    if (field === "email") {
      this.setState({
        email: e.target.value.toLowerCase().trim(),
        serverErrors: []
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

    return errors.length ? errors : null;
  };

  checkForErrors = (type) => {
    const { email, password } = this.state;
    const isEmailError = !Validator.isValidEmail(email);
    const isPasswordError = !password || password.length < 5;

    if ((type === "email" && isEmailError) || (!type && isEmailError)) {
      this.setError("email", this.t("errors.invalidEmail"));
    } else if (
      (type === "email" && !isEmailError) ||
      (!type && !isEmailError)
    ) {
      this.removeError("email");
    }

    if ((type === "password" && !password) || (!type && !password)) {
      this.setError("password", this.t("errors.emptyPassword"));
    } else if (
      (type === "password" && password.length < 5) ||
      (!type && password.length < 5)
    ) {
      this.setError("password", this.t("errors.tooShort"));
    } else if (
      (type === "password" && !isPasswordError) ||
      (!type && !isPasswordError)
    ) {
      this.removeError("password");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    const isEmailError = !Validator.isValidEmail(email);
    const isPasswordError = !password || password.length < 5;
    this.checkForErrors();

    if (!isEmailError && !isPasswordError) {
      this.setState({ isLoading: true });
      this.handleActionOnSubmit();
    }
  };

  handleActionOnSubmit = () => {
    this.props
      .actionOnSubmit(
        {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
        },
        this.props.lang
      )
      .then((serverErrors) => {
        this.setState({
          isLoading: false,
          serverErrors,
          isComplete: serverErrors.length == 0,
        });
      })
      .catch((error) => {
        console.error(error);

        this.setState({
          serverErrors: [
            { message: "произошла ошибка. попробуйте повторить запрос" },
          ],
          isLoading: false,
        });
      });
  };

  renderServerErrors = () => {
    if (
      !Array.isArray(this.state.serverErrors) ||
      this.state.serverErrors.length == 0
    )
      return null;

    const translationVariables = {
      email: this.state.email,
      linkToRecover: "/account/login#recover",
    };

    return this.state.serverErrors.map((error, i) => {
      const message =
        error.code && serverErrorsMapping[error.code]
          ? this.t(serverErrorsMapping[error.code], translationVariables)
          : error.message;

      return (
        <div
          key={i}
          className="error alert alert-danger text-center"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      );
    });
  };

  render() {
    const { firstName, lastName, email, password } = this.state;

    const emailError = !!this.getError("email");
    const passwordError = !!this.getError("password");

    return (
      <div className="PageRegisterAccount">
        <Header isPageHeader text={this.t("title")} />

        {this.renderServerErrors()}

        {this.state.isLoading && <LoadingIndicator />}
        {!this.state.isLoading && this.state.isComplete && (
          <>
            <div className="text-center">{this.t("success")}</div>
            <div className="sentIcon"></div>
          </>
        )}
        {!this.state.isLoading && !this.state.isComplete && (
          <form id="create_customer" onSubmit={this.handleSubmit}>
            <label htmlFor="FirstName">{this.t("firstName")}</label>
            <input
              type="text"
              defaultValue={firstName}
              name="customer[first_name]"
              id="FirstName"
              autoFocus
              autoComplete="given-name"
              onChange={(e) => this.handleChange("firstName", e)}
            />

            <label htmlFor="LastName">{this.t("lastName")}</label>
            <input
              type="text"
              defaultValue={lastName}
              name="customer[last_name]"
              id="LastName"
              autoComplete="family-name"
              onChange={(e) => this.handleChange("lastName", e)}
            />

            <label
              className={emailError ? "label--error" : undefined}
              htmlFor="CustomerEmail"
            >
              {this.getError("email") || this.t("email")}
            </label>
            <input
              type="text"
              defaultValue={email}
              name="customer[email]"
              id="CustomerEmail"
              autoComplete="email"
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
              className={emailError ? "input--error" : undefined}
              onChange={(e) => this.handleChange("email", e)}
              onBlur={() => this.checkForErrors("email")}
            />

            <label
              className={passwordError ? "label--error" : undefined}
              htmlFor="CustomerPassword"
            >
              {this.getError("password") || this.t("password")}
            </label>
            <input
              type="password"
              defaultValue={password}
              name="customer[password]"
              autoComplete="new-password"
              id="CustomerPassword"
              className={passwordError ? "input--error" : undefined}
              onChange={(e) => this.handleChange("password", e)}
              onBlur={() => this.checkForErrors("password")}
            />

            <p className="text-center">
              <input
                type="submit"
                value={this.t("buttonCreate")}
                className="btn"
              />
            </p>
          </form>
        )}
      </div>
    );
  }
}

PageRegisterAccount.defaultProps = {
  errors: [],
  isLoading: false,
  isComplete: false,
  actionOnSubmit,
};

const mapStateToProps = (state, ownProps) => {
  return {
    isComplete: ownProps.isComplete
      ? ownProps.isComplete
      : state.app.route.hash == "#success",
    serverErrors: Array.isArray(ownProps.serverErrors)
      ? ownProps.serverErrors
      : [],
  };
};
export default connect(mapStateToProps)(PageRegisterAccount);
