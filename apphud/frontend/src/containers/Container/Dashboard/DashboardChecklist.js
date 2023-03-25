import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import { updateApplicationRequest } from "../../../actions/application"
import {track} from "../../../libs/helpers";

const disabledIcon = (
  <svg
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1.5C3.2385 1.5 1 3.7385 1 6.5C1 9.2615 3.2385 11.5 6 11.5C8.7615 11.5 11 9.2615 11 6.5C11 3.7385 8.761 1.5 6 1.5ZM8.3535 8.1465L7.6465 8.8535L6 7.2075L4.3535 8.8535L3.6465 8.1465L5.2925 6.5L3.646 4.8535L4.353 4.147L5.9995 5.7935L7.646 4.147L8.353 4.8535L6.707 6.5L8.3535 8.1465Z"
      fill="#FF0C46"
    />
  </svg>
)
const checkIcon = (
  <svg
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1.5C3.2385 1.5 1 3.7385 1 6.5C1 9.2615 3.2385 11.5 6 11.5C8.7615 11.5 11 9.2615 11 6.5C11 3.7385 8.761 1.5 6 1.5ZM5.625 9.375L3.125 7.5L3.875 6.5L5.375 7.625L8 4.125L9 4.875L5.625 9.375Z"
      fill="#20BF55"
    />
  </svg>
)
const closeIcon = (close) => {
  return (
    <svg
      className="dashboard-checklist__content-close cp"
      onClick={close}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
          fill="#FCD6A7"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <path d="M0 0H24V24H0V0Z" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

class DashboardChecklist extends Component {

  componentDidMount() {
    const savedNum = localStorage.getItem("quick_setup_bar_shown");
    const num = this.checklistCompletedLength(this.props.application.checklist);
    localStorage.setItem("quick_setup_bar_shown", num);
    if (Number(num) !== Number(savedNum)) {
      track("quick_setup_bar_shown", {
        "steps_completed":  this.checklistCompletedLength(this.props.application.checklist)
      });
    }
  }

  getIcon = (value) => {
    return value ? checkIcon : disabledIcon
  };

  checklistCompletedLength = (checklist) => {
    return Object.keys(checklist).filter((key) => checklist[key]).length
  };

  checkListDone = (checklist) => {
    return this.checklistCompletedLength(checklist) === 4
  };

  handleClose = () => {
    const params = {
      id: this.props.appId,
      checklist_completed: true
    }
    track("quick_setup_bar_closed");
    this.props.updateApplicationRequest(params)
  };

  render() {
    const { appId, application } = this.props
    const { checklist } = this.props.application

    if (checklist) {
      const {
        sdk_integrated,
        test_purchase,
        has_integrations,
        has_rules
      } = checklist

      return (
        <div className="dashboard-checklist">
          <div className="dashboard-checklist__title">
            {this.checkListDone(checklist)
              ? "Setup complete!"
              : `Complete setup: ${this.checklistCompletedLength(
                  checklist
                )} of 4`}
          </div>
          <ul className="dashboard-checklist__content">
            <li className="dashboard-checklist__content-item">
              {this.getIcon(sdk_integrated)}
              <span className="va-top">
                Integrate Apphud SDK.{" "}
                <a
                  onClick={() => track("quick_setup_bar_link_clicked")}
                  href="https://docs.apphud.com/getting-started/sdk-integration"
                  target="_blank"
                  className="link"
                >
                  View docs
                </a>
              </span>
            </li>
            <li className="dashboard-checklist__content-item">
              {this.getIcon(test_purchase)}
              <span className="va-top">
                Make a test purchase.{" "}
                <a
                  onClick={() => track("quick_setup_bar_link_clicked")}
                  href="https://docs.apphud.com/getting-started/sandbox"
                  target="_blank"
                  className="link"
                >
                  How to do this?
                </a>
              </span>
            </li>
            <li className="dashboard-checklist__content-item">
              {this.getIcon(has_integrations)}
              <span className="va-top">
                Configure integration.{" "}
                <NavLink to={`/apps/${appId}/integrations/ios`} className="link" onClick={() => track("quick_setup_bar_link_clicked")}
                >
                  Add integration
                </NavLink>
              </span>
            </li>
            <li className="dashboard-checklist__content-item">
              {this.getIcon(has_rules)}
              <span className="va-top">
                Create a rule to increase app revenue and get product insights.{" "}
                <NavLink to={`/apps/${appId}/newrules/all`} className="link" onClick={() => track("quick_setup_bar_link_clicked")}
                >
                  Add a rule
                </NavLink>
              </span>
            </li>
          </ul>
          {this.checkListDone(checklist) ? closeIcon(this.handleClose) : ""}
        </div>
      )
    } else return <div />
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {
  updateApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardChecklist)
