import React, { Component } from "react";
import { translate } from "@Core/i18n";
import PageLink from "@Components/Structure/PageLink";
import actionSubmitLoginForm from "../../Login/actions/actionSubmitLoginForm";

@translate({
  customer: {
    login: {
      email: "Имейл",
      password: "Пароль",
      sign_in: "Войти",
      forgot_password: "Забыли пароль",
    },
  },
})
class LoginStatus extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.actionSubmitLoginForm({
      email: this.state && this.state.email ? this.state.email : "",
      password: this.state && this.state.password ? this.state.password : "",
      returnURL: "/pages/video",
    });
  };

  render() {
    const { form } = this.props;

    return (
      <div id="CustomerLoginForm" className="form-vertical">
        <form id="customer_login" onSubmit={this.handleSubmit}>
          <div className="text-center p-3">
            Для доступа введите ваш персональный пароль
          </div>

          {Object.keys(form.errors).map((key) => form.errors[key])}

          <div className="row justify-content-center">
            <input
              type="email"
              placeholder={this.t("customer.login.email")}
              onChange={(e) => this.setState({ email: e.target.value })}
              name="customer[email]"
              id="CustomerEmail"
              className={`col-md-5 col-sm-12 ${Object.keys(
                form.errors
              ).includes("email") && "input--error"}`}
              autoCorrect="off"
              autoFocus
            />
            <input
              type="password"
              placeholder={this.t("customer.login.password")}
              onChange={(e) => this.setState({ password: e.target.value })}
              name="customer[password]"
              id="CustomerPassword"
              className={`col-md-5 col-sm-12 ${Object.keys(
                form.errors
              ).includes("password") && "input--error"}`}
            />
            <input
              type="submit"
              className="col-auto btn"
              value={this.t("customer.login.sign_in")}
            />
            <input type="hidden" name="checkout_url" value="/pages/video" />
          </div>

          <div className="text-center">
            <p>
              <PageLink pageType={"PAGE_CUSTOMER_FORGOT_PASSORD"}>
                {this.t("customer.login.forgot_password")}
              </PageLink>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

LoginStatus.defaultProps = {
  form: {
    errors: {},
  },
  actionSubmitLoginForm: actionSubmitLoginForm,
};
export default LoginStatus;
