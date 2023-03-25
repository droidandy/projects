import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import classNames from "classnames"
import history from "../../history"
import { createUserRequest } from "../../actions/user"
import { authenticateSuccess } from "../../actions/sessions"
import moment from "moment"
import {track} from "../../libs/helpers";

// eslint-disable-next-line no-extend-native
Date.prototype.getCohortWeek = function() {
  var onejan = new Date(this.getFullYear(), 0, 1)
  return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7)
}

// eslint-disable-next-line no-extend-native
Date.prototype.getCohortDay = function() {
  const start = new Date(this.getFullYear(), 0, 0)
  const diff = this - start
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)
  return day
}

const queryString = require("query-string")

class SignUp extends Component {
  state = {
    email: "",
    username: "",
    validEmail: false,
    password: "",
    confirmPassword: "",
    pp_agreement: false,
    emailDisabled: false
  };

  componentDidMount() {
    document.title = "Apphud | Sign up"
    track("sign_up_form_opened", {referrer: document.referrer});
    if (window.location.search) {
      const queryParams = queryString.parse(window.location.search)
      const { email, invite_token } = queryParams

      if (email && invite_token) this.setState({ email, emailDisabled: true })
    }
  }

  emailValidation = (email) => {
    // eslint-disable-next-line
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/.test(email);
  };

  handleEmailChanged = (e) => {
    const email = e.target.value

    this.setState({
      email
    })
  };

  handleUsernameChanged = (e) => {
    const username = e.target.value

    this.setState({
      username
    })
  };

  handlePasswordChanged = (e) => {
    const password = e.target.value

    this.setState({
      password
    })
  };

  handleConfirmPasswordChanged = (e) => {
    const confirmPassword = e.target.value

    this.setState({
      confirmPassword
    })
  };

  handleSignUp = (e) => {
    e.preventDefault()
    this.setTimeSignUp()
    this.setState({ submitted: true })
    var requestData = {
      username: this.state.username.toLowerCase(),
      email: this.state.email.toLowerCase(),
      password: this.state.password,
      password_confirmation: this.state.confirmPassword,
      pp_agreement: this.state.pp_agreement
    }

    if (window.location.search) {
      const queryParams = queryString.parse(window.location.search)

      for (const key of Object.keys(queryParams)) {
        if (
          [
            "invite_token",
            "utm_source",
            "ref",
            "utm_medium",
            "utm_campaign"
          ].indexOf(key) > -1
        ) {
          requestData[key] = queryParams[key]

          if (key === "invite_token") { localStorage.setItem("invite", queryParams[key]) }
        }
      }
    }

    if (
      !requestData.password ||
      !this.emailValidation(this.state.email) ||
      this.state.password.length < 8 ||
      !requestData.password_confirmation
    ) {
      return track("sign_up_form_error_shown");
    }

    this.props.createUserRequest(requestData, (response) => {
      track("sign_up_form_button_clicked", {
        email: requestData.email
      });
      const user = response.data.data.results
      history.push("/contact-info")

      if (window.analytics) {
        let timezone = ""

        if (Intl) timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

        window.analytics.identify(
          user.id,
          {
            email: user.email,
            created_at: new Date(),
            rule_enabled: false,
            integration_enabled: false,
            apps_count: 0
          },
          {
            integrations: {
              All: true,
              Webhooks: false
            },
            context: {
              timezone
            }
          },
          () => {
            window.analytics.track("user_sign_up")
          }
        )
      }
    })
  };

  inputEmailClasses = () => {
    return classNames("input input_blue input_stretch", {
      input_error:
        (!this.state.email || !this.emailValidation(this.state.email)) &&
        this.state.submitted
    })
  };

  setTimeSignUp = () => {
    localStorage.setItem("signUpTime", new Date().getTime())
  };

  labelEmailClasses = () => {
    return classNames("l-p__label", {
      label_error:
        (!this.state.email || !this.emailValidation(this.state.email)) &&
        this.state.submitted
    })
  };

  inputUsernameClasses = () => {
    return classNames("input input_blue input_stretch", {
      input_error: !this.state.username && this.state.submitted
    })
  };

  labelUsernameClasses = () => {
    return classNames("l-p__label", {
      label_error: !this.state.username && this.state.submitted
    })
  };

  inputPasswordClasses = () => {
    return classNames("input input_blue input_stretch", {
      input_error:
        (!this.state.password || this.state.password.length < 8) &&
        this.state.submitted
    })
  };

  labelPasswordClasses = () => {
    return classNames("l-p__label", {
      input_error:
        (!this.state.password || this.state.password.length < 8) &&
        this.state.submitted
    })
  };

  inputPasswordConfirmationClass = () => {
    return classNames("input input_blue input_stretch", {
      input_error:
        (!this.state.confirmPassword ||
          this.state.password !== this.state.confirmPassword ||
          this.state.confirmPassword.length < 8) &&
        this.state.submitted
    })
  };

  labelPasswordConfirmClasses = () => {
    return classNames("l-p__label", {
      label_error:
        (!this.state.confirmPassword ||
          this.state.password !== this.state.confirmPassword) &&
        this.state.submitted
    })
  };

  request = (url, type, data, cb = () => {}) => {
    var xhr = new XMLHttpRequest()
    xhr.open(type, url, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onload = () => {
      if (xhr.status === 200) cb(JSON.parse(xhr.response))
    }
    xhr.send(JSON.stringify(data))
  };

  handleChangeAgreement = (e) => {
    this.setState({ pp_agreement: e.target.checked })
  };

  render() {
    const {
      email,
      username,
      password,
      confirmPassword,
      emailDisabled
    } = this.state

    return (
      <div className="login-page">
        <div className="login-wrapper">
          <div className="ta-center">
            <NavLink to="/" className="l-p__logo">
              <svg
                width="147"
                height="40"
                viewBox="0 0 147 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.0917 13C15.9717 11.04 13.4517 9.8 10.8117 9.8C5.05172 9.76 0.531719 13.32 0.531719 20.12C0.531719 27.04 4.85172 30.64 10.6917 30.6C12.8917 30.56 15.9717 29.44 17.0917 27.12L17.3317 30H21.9317V10.28H17.2517L17.0917 13ZM11.2517 14.16C18.9317 14.16 18.9317 26.12 11.2517 26.12C8.01172 26.12 5.41172 23.88 5.41172 20.12C5.41172 16.36 8.01172 14.16 11.2517 14.16ZM36.9848 25.76C33.6648 25.76 31.3848 23.24 31.3848 20.16C31.3848 17.08 33.4648 14.56 36.9848 14.56C40.5048 14.56 42.5848 17.08 42.5848 20.16C42.5848 23.24 40.3048 25.76 36.9848 25.76ZM30.9448 38.24V27.68C32.3448 29.84 35.4248 30.48 37.5048 30.48C43.8248 30.48 47.4648 25.92 47.4648 20.16C47.4648 14.36 43.4248 9.84 37.3448 9.84C35.1048 9.84 32.4648 10.8 30.9448 13L30.6248 10.28H26.0648V38.24H30.9448ZM61.9848 25.76C58.6648 25.76 56.3848 23.24 56.3848 20.16C56.3848 17.08 58.4648 14.56 61.9848 14.56C65.5048 14.56 67.5848 17.08 67.5848 20.16C67.5848 23.24 65.3048 25.76 61.9848 25.76ZM55.9448 38.24V27.68C57.3448 29.84 60.4248 30.48 62.5048 30.48C68.8248 30.48 72.4648 25.92 72.4648 20.16C72.4648 14.36 68.4248 9.84 62.3448 9.84C60.1048 9.84 57.4648 10.8 55.9448 13L55.6248 10.28H51.0648V38.24H55.9448ZM76.0648 2V30H80.9448V19.92C80.9448 16.96 82.9448 14.52 85.8248 14.52C88.4248 14.52 90.3048 16.04 90.3048 19.64V30H95.1848V19.6C95.1848 13.8 92.7048 10 87.1048 10C84.8648 10 82.7048 10.68 80.9448 12.96V2H76.0648ZM99.0364 10.28V20.64C99.0364 26.76 102.476 30.32 107.196 30.32C109.956 30.32 111.836 29.36 113.876 27.36L114.196 30.04H118.556V10.28H113.716V20.36C113.716 23.36 111.676 25.88 108.676 25.88C105.556 25.88 103.916 23.6 103.916 20.6V10.28H99.0364ZM132.422 14.36C135.502 14.36 138.142 16.68 138.142 20.12C138.142 23.68 135.502 25.92 132.422 25.92C129.302 25.92 126.822 23.56 126.822 20.12C126.822 16.56 129.302 14.36 132.422 14.36ZM138.462 2.04V12.96C137.302 10.92 134.062 9.8 131.982 9.8C126.222 9.8 121.942 13.32 121.942 20.12C121.942 26.6 126.302 30.44 132.102 30.44C134.502 30.44 136.942 29.64 138.462 27.28L138.782 30H143.342V2.04H138.462Z"
                  fill="#0085FF"
                />
              </svg>
            </NavLink>
          </div>
          <form
            className="ta-left l-p__form"
            name="loginForm"
            onSubmit={this.handleSignUp}
          >
            <div className="l-p__title ta-center">Nice to meet you!</div>
            <div className="l-p__description ta-center">
              <span>Already have Apphud account? </span>
              <NavLink to="/" className="link">
                Sign in
              </NavLink>
            </div>
            <div className="ta-left">
              <label className={this.labelEmailClasses()} htmlFor="login">
                Work email
              </label>
              <input
                value={email}
                onChange={this.handleEmailChanged}
                id="user_email"
                placeholder="Email"
                disabled={emailDisabled}
                type="text"
                name="email"
                required=""
                className={this.inputEmailClasses()}
              />
            </div>
            <div className="input-wrapper ta-left">
              <label className="l-p__label" htmlFor="login">
                Create a password
              </label>
              <input
                value={password}
                onChange={this.handlePasswordChanged}
                id="user_password"
                placeholder="Password"
                type="password"
                name="password"
                required=""
                className={this.inputPasswordClasses()}
              />
            </div>
            <div className="input-wrapper__bottom-text">
              Password must contain at least 8 characters
            </div>
            <div className="input-wrapper ta-left">
              <label
                className={this.labelPasswordConfirmClasses()}
                htmlFor="login"
              >
                Repeat a password
              </label>
              <input
                value={confirmPassword}
                onChange={this.handleConfirmPasswordChanged}
                id="user_password_confirm"
                placeholder="Password"
                type="password"
                name="password_confirmation"
                required=""
                className={this.inputPasswordConfirmationClass()}
              />
            </div>
            <div className="input-wrapper ta-left l-p__button__wrap">
              <button className="button button_green mt30 button_stretch button_block">
                Sign up
              </button>
              <div className="l-p__button-bottom l-p__button-bottom_custom nowrap">
                By signing up you agree with{" "}
                <a
                  href="https://legal.apphud.com/terms"
                  target="_blank"
                  className="link"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="https://legal.apphud.com/privacy"
                  target="_blank"
                  className="link"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  createUserRequest,
  authenticateSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
