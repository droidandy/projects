import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import axios from "axios"
import { NotificationManager } from "../../../../../libs/Notifications"
import InputSelect from "../../../../Common/InputSelect"

import imageWaiting2 from "../../../../../assets/images/pushrules2.png"

import { fetchRuleRequest } from "../../../../../actions/rule"

class PushRulesTest extends Component {
  state = {
    loading: true,
    test: {
      push_token: ""
    }
  };

  componentDidMount() {
    document.title = "Apphud | Test rule"
  }

  componentWillMount() {
    this.props.fetchRuleRequest(this.props.match.params.ruleId)
  }

  handleChangeToken = (e) => {
    const { test } = this.state
    test.push_token = e.target.value
    this.setState({ test })
  };

  send = (rule, cb = () => {}) => {
    this.setState({ submitted: true })

    if (this.state.test.push_token) {
      axios
        .post(`/rules/${this.props.match.params.ruleId}/test`, this.state.test)
        .then(() => {
          NotificationManager.success("Test sent", "OK", 5000)
          this.setState({ submitted: false })
        })
    }
  };

  fieldClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && !this.state.test[field]
    })
  };

  render() {
    const { push_token } = this.state.test

    return (
      <div className="container-content container-content__white container-content__integrations">
        <div className="container-content__integrations-settings__content">
          <div className="container-content__integrations-settings__content-title">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 1C4.44772 1 4 1.44772 4 2V14C4 14.5523 4.44772 15 5 15H11C11.5523 15 12 14.5523 12 14V2C12 1.44772 11.5523 1 11 1H5ZM11 3H5V13H11V3Z"
                fill="#97ADC6"
              />
            </svg>
            <span className="capitalize">Test devices</span>
          </div>
          <div className="input-wrapper ta-left">
            <label className="l-p__label">
              Push token to receive test Push notification
            </label>
            <div>
              <div className="input-wrapper__required">
                <input
                  value={push_token}
                  onChange={this.handleChangeToken}
                  id="push_token"
                  placeholder="Push token"
                  type="text"
                  name="push_token"
                  required=""
                  className={this.fieldClasses("push_token")}
                />
                <span className="required-label">Required</span>
              </div>
            </div>
          </div>
          <button
            className="button button_green l-p__button"
            onClick={this.send}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.12863 8.5C3.89397 8.5 3.6773 8.624 3.5573 8.82267L1.09463 12.9273C0.950633 13.1667 0.972633 13.4727 1.1493 13.69C1.32597 13.9073 1.61997 13.9907 1.8853 13.8993L13.8853 9.79667C14.1926 9.69 14.3786 9.37667 14.3246 9.056C14.2706 8.734 13.9926 8.5 13.6666 8.5H4.12863Z"
                fill="white"
              />
              <path
                d="M4.12863 7.5C3.89397 7.5 3.6773 7.376 3.5573 7.17733L1.09463 3.07267C0.950633 2.83333 0.972633 2.52733 1.1493 2.31C1.32597 2.09267 1.61997 2.00933 1.8853 2.10067L13.8853 6.20333C14.1926 6.31 14.3786 6.62333 14.3246 6.944C14.2706 7.266 13.9926 7.5 13.6666 7.5H4.12863Z"
                fill="white"
              />
            </svg>
            <span>Send</span>
          </button>
        </div>
        {/* <div className="ta-center empty-label">
          <img src={imageWaiting2} className="empty-label__image" alt="No users" width="540px" />
          <div className="empty-label__title">Configure a rule first</div>
          <a className="empty-label__link" href="https://icons8.com/" target="_blank">Illustration by Icons8</a>
        </div> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchRuleRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(PushRulesTest)
