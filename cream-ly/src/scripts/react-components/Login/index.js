import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "@Components/index";

import { translate } from "@Core/i18n";

import BackButton from "./sections/BackButton";
import LoginForm from "./sections/LoginForm";
import RecoverPasswordForm from "./sections/RecoverPasswordForm";

import * as Validator from "@Core/utils/validators";

import actionGoToRegistration from "./actions/actionGoToRegistration";
import actionGoToReturnURL from "./actions/actionGoToReturnURL";
import actionSubmitForgetPassword from "./actions/actionSubmitForgetPassword.ts";
import actionSubmitLoginForm from "./actions/actionSubmitLoginForm";

import "./index.scss";

@translate({}, "Login")
class Login extends Component {
  state = {
    isRecoveryModeOn: this.props.isRecoveryModeOn,
    errors: this.props.errors,
    email:
      this.props.email && typeof this.props.email === "string"
        ? this.props.email.toLowerCase().trim()
        : this.props.email,
    password: this.props.password,
  };

  handleChange = (field, e) => {
    if (this.getError(field)) {
      this.checkForErrors();
    }
    this.removeError("global");

    if (field === "email") {
      this.setState({ email: e.target.value.toLowerCase().trim() });
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
    const isPasswordError = !password;

    if ((type === "email" && isEmailError) || (!type && isEmailError)) {
      this.setError("email", this.t("Login:errors.invalidEmail"));
    } else if (
      (type === "email" && !isEmailError) ||
      (!type && !isEmailError)
    ) {
      this.removeError("email");
    }

    if (
      (type === "password" && isPasswordError) ||
      (!type && isPasswordError)
    ) {
      this.setError("password", this.t("Login:errors.emptyPassword"));
    } else if (
      (type === "password" && !isPasswordError) ||
      (!type && !isPasswordError)
    ) {
      this.removeError("password");
    }
  };

  toggleRecoveryMode(event) {
    event.preventDefault();
    this.setState({
      isRecoveryModeOn: !this.state.isRecoveryModeOn,
      errors: [],
    });
  }

  render() {
    return (
      <div className="CustomerLoginForm">
        {this.state.isRecoveryModeOn ? (
          <RecoverPasswordForm
            isSent={this.props.isSent}
            isLoading={this.props.isLoading}
            lang={this.props.lang}
            serverErrors={this.props.serverErrors}
            email={this.state.email}
            returnURL={this.props.returnURL}
            onClickCancel={this.toggleRecoveryMode.bind(this)}
            checkForErrors={this.checkForErrors}
            getError={this.getError}
            removeError={this.removeError}
            handleChange={this.handleChange}
            actionSubmitForgetPassword={this.props.actionSubmitForgetPassword}
            onBlur={(e) => this.checkForErrors(e)}
          />
        ) : (
          <LoginForm
            lang={this.props.lang}
            email={this.state.email}
            password={this.state.password}
            errors={this.props.errors}
            actionSubmitLoginForm={this.props.actionSubmitLoginForm}
            onClickForgetPassword={this.toggleRecoveryMode.bind(this)}
            checkForErrors={this.checkForErrors}
            getError={this.getError}
            removeError={this.removeError}
            handleChange={this.handleChange}
            actionGoToRegistration={this.props.actionGoToRegistration}
            onBlur={(e) => this.checkForErrors(e)}
          />
        )}
        {this.props.returnURL && (
          <BackButton
            lang={this.props.lang}
            url={this.props.returnURL}
            onClick={this.props.actionGoToReturnURL}
          />
        )}
      </div>
    );
  }
}

Login.defaultProps = {
  isRecoveryModeOn: false,
  isLoading: false,
  errors: [],
  serverErrors: [],
  actionGoToRegistration,
  actionGoToReturnURL,
  actionSubmitForgetPassword,
  actionSubmitLoginForm,
};

Login.propTypes = {
  email: PropTypes.string,
  errors: PropTypes.array,
  serverErrors: PropTypes.array,
  password: PropTypes.string,
  isSent: PropTypes.bool,
  isLoading: PropTypes.bool,
  lang: PropTypes.string,
  returnURL: PropTypes.string,
  actionSubmitForgetPassword: PropTypes.func,
  actionSubmitLoginForm: PropTypes.func,
  actionGoToRegistration: PropTypes.func,
  actionGoToReturnURL: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  return {
    errors: Array.isArray(ownProps.errors) ? ownProps.errors : [],
    returnURL: ownProps.returnURL
      ? ownProps.returnURL
      : state.app.route.params.checkout_url,
    isRecoveryModeOn: ownProps.isRecoveryModeOn
      ? ownProps.isRecoveryModeOn
      : state.app.route.hash == "#recover",
  };
};

export default connect(mapStateToProps)(Login);
