import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import {
  authenticateRequest,
  authenticateSuccess
} from "../../actions/sessions"
import { fetchApplicationsRequest } from "../../actions/applications"
import history from "../../history"
import { fetchUserRequest } from "../../actions/user"
import TokenService from "../../libs/TokenService"
import { fetchApplicationRequest } from "../../actions/application";
import { fetchBillingUsageStats } from "actions/billing"
const tokenService = TokenService.getService()

const valueIsValid = (value) => {
  return value && value.length >= 3
}

class SignIn extends Component {
  state = {
    email: "",
    validEmail: false,
    password: "",
    loading: false
  };

  checkContactInfo = (user, callback) => {
    const { name, company_name, phone } = user

    if (
      !valueIsValid(name) ||
      !valueIsValid(company_name) ||
      !valueIsValid(phone)
    ) {
      localStorage.setItem("contactInfoInvalid", true)
      history.push("/contact-info")
    } else callback()
  };

  disableLoading = () => {
    this.setState({ loading: false })
  };

  fetchApps = (user) => {
    this.props.fetchApplicationsRequest(
      (apps) => {
        if (this.props.userDbId) {
          if (window.analytics) {
            window.segmentHelper.identify(
              user.id,
              {},
              {
                integrations: {
                  All: true,
                  Webhooks: false
                }
              }
            )
          }

          this.checkContactInfo(user, () => {
            if (apps.length === 0) history.push("/newapp")
            else {
              const lastId = localStorage.getItem("lastApplicationId")
              let lastApp = apps[0]
              if (lastId) {
                const app = apps.find((app) => app.id === lastId)

                if (app) lastApp = app
              }
              history.push(`/apps/${lastApp.id}/dashboard`)
              // this.props.fetchBillingUsageStats()
            }
          })
        }

        this.disableLoading()
      },
      this.disableLoading,
      true
    )
  };

  routeUser = (user) => {
    if (localStorage.getItem("persist:primary")) {
      const primary = JSON.parse(localStorage.getItem("persist:primary"))
      if (JSON.parse(primary.sessions).id) {
        if (tokenService.getToken()) this.setState({ loading: true })
        if (user) {
          this.fetchApps(user)
        }
        else {
          if (tokenService.getToken()) {
            this.props.fetchUserRequest(this.fetchApps, this.disableLoading)
          }
        }
      }
    }
  };

  componentDidMount() {
    document.title = "Apphud | Sign in"
    this.routeUser()
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

  handlePasswordChanged = (e) => {
    const password = e.target.value

    this.setState({
      password
    })
  };

  handleSignIn = (e) => {
    e.preventDefault()

    const email = this.state.email.toLowerCase()
    const password = this.state.password
    this.setState({ submitted: true })

    if (this.emailValidation(email)) {
      this.setState({ loading: true })
      this.props.authenticateRequest(
        { email, password },
        (user) => {
          window.segmentHelper.identify(
            user.id,
            {},
            {
              integrations: {
                All: true,
                Webhooks: false
              }
            }
          )
          window.analytics.track(
            "user_sign_in",
            {},
            {
              integrations: {
                All: true,
                Webhooks: false
              }
            }
          )
          setTimeout(() => {
            this.routeUser(user)
          })
        },
        this.disableLoading
      )
    }
  };

  inputEmailClasses = () => {
    return classNames("input input_blue input_stretch", {
      input_error:
        (!this.state.email || !this.emailValidation(this.state.email)) &&
        this.state.submitted
    })
  };

  labelEmailClasses = () => {
    return classNames("l-p__label", {
      label_error:
        (!this.state.email || !this.emailValidation(this.state.email)) &&
        this.state.submitted
    })
  };

  inputPasswordClass = () => {
    return classNames("input input_blue input_stretch", {
      input_error: !this.state.password && this.state.submitted
    })
  };

  labelPasswordClass = () => {
    return classNames("l-p__label", {
      label_error: !this.state.password && this.state.submitted
    })
  };

  render() {
    const { email, password, loading } = this.state

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
            onSubmit={this.handleSignIn}
          >
            <div className="l-p__title ta-center">Welcome back!</div>
            <div className="l-p__description ta-center">
              <span>Don’t have Apphud account? </span>
              <NavLink to="/sign_up" className="link">
                Sign up
              </NavLink>
            </div>
            <div className="input-wrapper ta-left">
              <label className={this.labelEmailClasses()} htmlFor="login">
                Your email
              </label>
              <input
                value={email}
                onChange={this.handleEmailChanged}
                id="login"
                autoFocus="autofocus"
                placeholder="Your Email"
                type="text"
                name="login"
                required=""
                className={this.inputEmailClasses()}
              />
            </div>
            <div className="input-wrapper ta-left">
              <label className={this.labelPasswordClass()} htmlFor="password">
                Password
              </label>
              <input
                value={password}
                onChange={this.handlePasswordChanged}
                id="password"
                placeholder="Enter password"
                type="password"
                name="password"
                required=""
                className={this.inputPasswordClass()}
              />
            </div>
            <NavLink
              to="/reset_password/blank"
              className="link link-bottom-input"
            >
              Forgot password?
            </NavLink>
            <div className="ta-left l-p__button__wrap">
              <button
                disabled={loading}
                className="button button_green mt30 button_block button_stretch"
              >
                {loading ? "Loading..." : "Sign in"}
              </button>
              <div className="l-p__button-bottom ta-center">
                By signing in you agree with{" "}
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
  return {
    loggingIn: state,
    user: state.sessions,
    userDbId: state.sessions.db_id,
    userEmail: state.sessions.email,
    userName: state.sessions.name,
    application: state.application
  }
}

const mapDispatchToProps = {
  authenticateRequest,
  authenticateSuccess,
  fetchApplicationsRequest,
  fetchApplicationRequest,
  fetchUserRequest,
  fetchBillingUsageStats,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
