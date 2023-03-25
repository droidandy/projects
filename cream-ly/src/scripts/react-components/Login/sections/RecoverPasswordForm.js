import React, { Component } from "react";

import Header from "@Components/Structure/Header";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";

import { translate } from "@Core/i18n";
import PropTypes from "prop-types";

import * as Validator from "@Core/utils/validators";

const serverErrorsMapping = {
  UNIDENTIFIED_CUSTOMER: "recover.serverErrors.unidentifiedEmail",
};

@translate(
  {
    recover: {
      title: "ВОССТАНОВИТЬ ПАРОЛЬ",
      subtext: "Мы отправим вам имейл для восстановления вашего пароля.",
      emailLabel: "Введите ваш Имэйл",
      buttonSend: "Отправить",
      buttonCancel: "Отменить",
    },
  },
  "Login"
)
export default class RecoverPasswordForm extends Component {
  state = {
    isSent: this.props.isSent,
    isLoading: this.props.isLoading,
    serverErrors: this.props.serverErrors,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { email } = this.props;
    const isEmailError = !Validator.isValidEmail(email);
    this.props.checkForErrors();

    if (!isEmailError) {
      this.setState({
        isLoading: true,
      });
      this.props
        .actionSubmitForgetPassword(email)
        .then((serverErrors) => {
          this.setState({
            isLoading: false,
            isSent: serverErrors.length == 0,
            serverErrors,
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
    }
  };

  renderServerErrors = () => {
    if (
      !Array.isArray(this.state.serverErrors) ||
      this.state.serverErrors.length == 0
    )
      return null;

    const translationVariables = {
      email: this.props.email,
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
    const globalErrorText = this.props.getError("global")
      ? this.t(this.props.getError("global")[0])
      : null;
    const emailError = !!(
      this.props.getError("email") || this.props.getError("global")
    );

    return (
      <div data-recover-form="true">
        {this.props.getError("global") && (
          <div
            className="error alert alert-danger text-center"
            dangerouslySetInnerHTML={{ __html: globalErrorText }}
          ></div>
        )}
        <Header text={this.t("recover.title")} />

        {this.state.isLoading && <LoadingIndicator />}

        {!this.state.isLoading && this.state.isSent && (
          <div className="note form-success text-center">
            {this.t("recover.success")}
          </div>
        )}

        {!this.state.isLoading && !this.state.isSent && (
          <div className="form-vertical">
            <div className="text-center mb-5">{this.t("recover.subtext")}</div>

            {this.renderServerErrors()}

            <form
              method="post"
              onSubmit={this.handleSubmit}
              action="/account/recover"
            >
              <input
                type="hidden"
                name="form_type"
                value="recover_customer_password"
              />
              <input
                type="hidden"
                name="customer[tags][locale]"
                value={this.props.lang}
              />

              <label
                className={emailError ? "label--error" : undefined}
                htmlFor="RecoverEmail"
              >
                {this.props.getError("email") || this.t("recover.emailLabel")}
              </label>
              <input
                type="text"
                value={this.props.email}
                name="email"
                autoFocus
                autoComplete="email"
                id="RecoverEmail"
                className={emailError ? "input--error" : undefined}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  this.setState({ serverErrors: [] });
                  this.props.handleChange("email", e);
                }}
                onBlur={() => this.props.onBlur("email")}
              />

              <div className="text-center">
                <p>
                  <input
                    type="submit"
                    className="btn"
                    value={this.t("recover.buttonSend")}
                  />
                </p>

                <button
                  type="button"
                  className="text-link"
                  onClick={this.props.onClickCancel}
                >
                  {this.t("recover.buttonCancel")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}

RecoverPasswordForm.propTypes = {
  isSent: PropTypes.bool,
  isLoading: PropTypes.bool,
  lang: PropTypes.string,
  email: PropTypes.string,
  serverErrors: PropTypes.array,
  checkForErrors: PropTypes.func,
  actionSubmitForgetPassword: PropTypes.func,
  getError: PropTypes.func,
  handleChange: PropTypes.func,
  onBlur: PropTypes.func,
  onClickCancel: PropTypes.func,
};
