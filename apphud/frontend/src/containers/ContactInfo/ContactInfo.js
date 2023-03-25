import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../history"
import image from "../../assets/images/image-sign_in.png"
import { updateUserRequest } from "../../actions/user"
import InputSelect from "../Common/InputSelect"
import {track, validation} from "../../libs/helpers"
import { fetchApplicationsRequest } from "../../actions/applications"

const referrerOptions = [
  { name: "Search engine", id: "Search engine" },
  { name: "Word of mouth", id: "Word of mouth" },
  {
    name: "Social media (Facebook, Twitter, etc.)",
    id: "Social media (Facebook, Twitter, etc.)"
  },
  {
    name: "Source for developers (StackOverflow, Hacker Noon, etc.)",
    id: "Source for developers (StackOverflow, Hacker Noon, etc.)"
  },
  { name: "Apphud blog", id: "Apphud blog" },
  { name: "Other", id: "Other" }
]

class ContactInfo extends Component {
  state = {
    name: "",
    company_name: "",
    phone: "",
    referrer: ""
  };

  componentDidMount() {
    const { name, phone, company_name, referrer } = this.props.user

    document.title = "Apphud | Contact info"

    this.setState({
      name,
      phone,
      company_name,
      referrer
    })

    if (localStorage.getItem("contactInfoInvalid")) { this.setState({ submitted: true }) }
  }

  handleNameChanged = (e) => {
    const name = e.target.value

    this.setState({
      name
    })
  };

  handleCompanyNameChanged = (e) => {
    const company_name = e.target.value

    this.setState({
      company_name
    })
  };

  handlePhoneChanged = (e) => {
    const phone = e.target.value

    // if (validation(phone, "phone") || phone === "") {
      this.setState({
        phone
      })
    // }
  };

  handleReferralChanged = ({ id }) => {
    this.setState({
      referrer: id
    })
  };

  trackSegment = () => {
    const { name, company_name, phone, referrer } = this.state
    const { email, id } = this.props.user

    if (window.analytics) {
      const paramsForSegment = {
        name,
        email,
        phone,
        referrer,
        company: {
          name: company_name,
          id: company_name
        }
      }
      window.segmentHelper.identify(id, paramsForSegment, {
        integrations: {
          All: true,
          Webhooks: false
        }
      })
      window.analytics.track("user_info_submitted", {
        name,
        email,
        phone,
        referrer,
        company: company_name
      })
    }
  };

  handleUpdateUser = (e) => {
    e.preventDefault()
    this.setState({ submitted: true })
    const { name, company_name, phone, referrer } = this.state
    const { email } = this.props.user
    const params = {
      name,
      email,
      phone,
      referrer,
      company_name
    }
    if (
      name &&
      name.length >= 3 &&
      company_name &&
      company_name.length >= 3 &&
      // validation(phone, "phone") &&
      // phone.length >= 3 &&
      referrer
    ) {
      this.props.updateUserRequest(params, (user) => {
        this.trackSegment()
        if (
          localStorage.getItem("contactInfoInvalid") ||
          localStorage.getItem("invite")
        ) {
          localStorage.removeItem("contactInfoInvalid")
          localStorage.removeItem("invite")

          this.props.fetchApplicationsRequest((apps) => {
            if (apps.length === 0) {
              history.push("/newapp")
            } else {
              const lastApp = apps[0]

              history.push(`/apps/${lastApp.id}/dashboard`)
            }
          })
        } else history.push({ pathname: "/newapp", search: "?onboarding=1" })
      })
    }else{
      track("onboarding_about_error_shown");
    }
  };

  inputNameClasses = () => {
    return classNames("input input_blue input_stretch", {
      input_error:
        (!this.state.name || this.state.name.length < 3) &&
        this.state.submitted
    })
  };

  inputCompanyNameClasses = () => {
    return classNames("input input_blue input_stretch", {
      input_error:
        (!this.state.company_name || this.state.company_name.length < 3) &&
        this.state.submitted
    })
  };

  inputPhoneClasses = () => {
    const { phone } = this.state

    return classNames("input input_blue input_stretch", {
      // input_error:
      //   (!phone ||
      //     (phone && phone.length < 3) ||
      //     !validation(phone, "phone")) &&
      //   this.state.submitted
    })
  };

  referrerSelectClasses = () => {
    const { submitted, referrer } = this.state
    return classNames("input-select_blue", {
      select_error: submitted && !referrer
    })
  };

  render() {
    const { name, company_name, phone, referrer } = this.state

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
            onSubmit={this.handleUpdateUser}
          >
            <div className="l-p__title mb30 ta-center">
              Please tell about yourself
            </div>
            <div className="input-wrapper ta-left">
              <label className="l-p__label" htmlFor="login">
                Your name
              </label>
              <input
                value={name}
                onChange={this.handleNameChanged}
                id="login"
                autoFocus="autofocus"
                placeholder="Full name"
                type="text"
                name="login"
                required=""
                className={this.inputNameClasses()}
              />
            </div>
            <div className="input-wrapper ta-left">
              <label className="l-p__label" htmlFor="company-name">
                Your company name
              </label>
              <input
                value={company_name}
                onChange={this.handleCompanyNameChanged}
                id="company-name"
                placeholder="Company name"
                type="text"
                name="company-name"
                required=""
                className={this.inputCompanyNameClasses()}
              />
            </div>
            <div className="input-wrapper__bottom-text">
              Must contain at least 3 characters
            </div>
            <div className="input-wrapper ta-left">
              <label className="l-p__label" htmlFor="phone-number">
                Phone number (optional)
              </label>
              <input
                value={phone}
                onChange={this.handlePhoneChanged}
                id="phone-number"
                placeholder="Phone number"
                type="text"
                name="phone-number"
                required=""
                className={this.inputPhoneClasses()}
              />
            </div>
             <div className="input-wrapper__bottom-text">
              Can contain only numbers, plus and space characters
             </div>
            <div className="input-wrapper ta-left">
              <label className="l-p__label" htmlFor="referrer">
                How did you hear about Apphud?
              </label>
              <InputSelect
                name="referrer"
                value={referrerOptions.find((r) => r.id === referrer)}
                onChange={this.handleReferralChanged}
                isSearchable={false}
                autoFocus={false}
                clearable={false}
                getOptionLabel={({ name }) => name}
                getOptionValue={({ id }) => id}
                classNamePrefix="input-select"
                className={this.referrerSelectClasses()}
                placeholder="Сhoose an option"
                options={referrerOptions}
              />
            </div>
            <div className="input-wrapper">
              <button className="button button_green mt30 button_stretch button_block">
                Continue
              </button>
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
    user: state.sessions
  }
}

const mapDispatchToProps = {
  updateUserRequest,
  fetchApplicationsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfo)
