import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import history from "../../../../history"
import Modal from "react-modal"
import { fetchRulesRequest } from "../../../../actions/rules"
import classNames from "classnames"
import SelectTemplate from "./SelectTemplate"
import RulesConfirmsModal from "../RulesConfirmsModal"

import { fetchApplicationRequest } from "../../../../actions/application"

import RulesShowStep1 from "./RulesShowStep1"
import RulesShowStep2 from "./RulesShowStep2"
import RulesShowStep3 from "./RulesShowStep3"
import RulesShowStep4 from "./RulesShowStep4"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 410
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class RulesShow extends Component {
  state = {
    currentStep: 1,
    confirmModal: {
      title: "",
      description: "",
      onConfirm: () => {},
      onCancel: () => {},
      confirmButtonText: "",
      cancelButtonText: "",
      open: false
    }
  };

  showConfirmModal = ({
    type,
    title,
    description,
    confirmButtonText,
    cancelButtonText,
    onConfirm,
    onCancel
  }) => {
    this.setState({
      confirmModal: {
        type,
        title,
        description,
        cancelButtonText,
        confirmButtonText,
        onConfirm,
        onCancel,
        show: true
      }
    })
  };

  closeConfirmModal = () => {
    this.setState({
      confirmModal: {
        type: "",
        title: "",
        description: "",
        confirmButtonText: "",
        onConfirm: () => {},
        onCancel: () => {},
        cancelButtonText: "",
        show: false
      }
    })
  };

  componentWillMount() {
    this.props.fetchApplicationRequest(this.props.match.params.appId)
  }

  itemClass = (_step) => {
    const { step } = this.props.match.params
    return classNames(
      "newapp-header__steps-item newapp-header__steps-item_rules",
      {
        "newapp-header__steps-item_active": parseInt(step, 10) === _step,
        "newapp-header__steps-item_completed": parseInt(step, 10) > _step
      }
    )
  };

  containerClassNames = () => {
    const { step } = this.props.match.params
    return classNames("container-content container-content__blue", {
      "container-content__rules_white container-content__rules-result":
        [1, 2, 4].indexOf(parseInt(step, 10)) > -1,
      "container-content__rules": [1, 2, 3].indexOf(parseInt(step, 10)) > -1
    })
  };

  title = () => {
    const { rule, match } = this.props
    const { ruleId } = match.params

    if (ruleId === "new") return "Select template"

    return (
      (rule.results && rule.results.id === ruleId && rule.results.name) || ""
    )
  };

  handleClickTab = (e) => {
    e.preventDefault()
  };

  handleClose = () => {
    const { appId, rulesType } = this.props.match.params

    if (window.hasUnsavedChanges) {
      if (window.hasUnsavedChanges()) {
        this.showConfirmModal({
          type: "save",
          title: "You have unsaved changes. Save?",
          description: "",
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          onConfirm: () => {
            window.updateRule(
              () => {
                history.push(`/apps/${appId}/newrules/${rulesType}`)
              },
              () => {
                this.closeConfirmModal()
              }
            )
          },
          onCancel: () => {
            history.push(`/apps/${appId}/newrules/${rulesType}`)
          }
        })
      } else history.push(`/apps/${appId}/newrules/${rulesType}`)
    } else history.push(`/apps/${appId}/newrules/${rulesType}`)
  };

  render() {
    const { ruleId, step, appId, rulesType } = this.props.match.params
    const { confirmModal } = this.state
    return (
      <div className={this.containerClassNames()}>
        {confirmModal.show && (
          <RulesConfirmsModal
            type={confirmModal.type}
            title={confirmModal.title}
            description={confirmModal.description}
            confirmButtonText={confirmModal.confirmButtonText}
            onConfirm={confirmModal.onConfirm}
            onCancel={confirmModal.onCancel}
            cancelButtonText={confirmModal.cancelButtonText}
            close={this.closeConfirmModal}
          />
        )}
        <div className="container-top container-content__blue-header">
          <div className="fl">
            <div className="container-title container-title_withdescription">
              <svg
                onClick={this.handleClose}
                className="va-middle newapp-container__icon-back cp"
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
                    d="M19.0711 4.92893C22.9763 8.83417 22.9763 15.1658 19.0711 19.0711C15.1658 22.9763 8.83417 22.9763 4.92893 19.0711C1.02369 15.1658 1.02369 8.83418 4.92893 4.92893C8.83417 1.02369 15.1658 1.02369 19.0711 4.92893ZM10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12Z"
                    fill="#97ADC6"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="va-middle" id="rule-title">
                {this.title()}
              </span>
            </div>
            {ruleId !== "new" && (
              <div className="newapp-header__steps newapp-header__steps_rules">
                <NavLink
                  onClick={this.handleClickTab}
                  className={this.itemClass(1)}
                  to={`/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/1`}
                >
                  <svg
                    className="newapp-header__steps-item__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.002 9V7H12.9C12.77 6.362 12.515 5.771 12.167 5.246L12.951 4.462L11.537 3.048L10.752 3.832C10.228 3.486 9.637 3.231 9.001 3.102V2H7.001V3.102C6.364 3.231 5.772 3.486 5.248 3.833L4.465 3.05L3.051 4.464L3.834 5.247C3.486 5.771 3.232 6.363 3.102 7H2V9H3.102C3.232 9.638 3.486 10.229 3.835 10.754L3.051 11.538L4.466 12.951L5.249 12.167C5.774 12.515 6.365 12.77 7.002 12.899V14.001H9.002V12.898C9.639 12.769 10.231 12.513 10.755 12.166L11.539 12.949L12.952 11.535L12.168 10.752C12.515 10.228 12.77 9.637 12.9 9H14.002ZM8 10C6.895 10 6 9.104 6 8C6 6.896 6.895 6 8 6C9.104 6 10 6.896 10 8C10 9.104 9.104 10 8 10Z"
                      fill="white"
                    />
                  </svg>
                  <span>Setup</span>
                  <svg
                    className="newapp-header__steps-item__triangle"
                    width="23"
                    height="40"
                    viewBox="0 0 23 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                      stroke="#0085FF"
                    />
                  </svg>
                </NavLink>
                <NavLink
                  onClick={this.handleClickTab}
                  className={this.itemClass(2)}
                  to={`/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/2`}
                >
                  <svg
                    className="newapp-header__steps-item__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="6" cy="5.5" r="3" fill="white" />
                    <path
                      d="M11 14C11 12.6739 10.4732 11.4021 9.53553 10.4645C8.59785 9.52678 7.32608 9 6 9C4.67392 9 3.40215 9.52678 2.46447 10.4645C1.52678 11.4021 1 12.6739 1 14L6 14H11Z"
                      fill="white"
                    />
                    <circle cx="11.5" cy="6" r="1.5" fill="white" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.0793 11C11.8316 10.4326 11.4784 9.9107 11.0322 9.46447C10.6586 9.09087 10.232 8.7825 9.77002 8.54669C10.2721 8.19332 10.8744 8 11.4967 8C12.2923 8 13.0554 8.31607 13.618 8.87868C14.1806 9.44129 14.4967 10.2044 14.4967 11H12.0793Z"
                      fill="white"
                    />
                  </svg>
                  <span>User segments</span>
                  <svg
                    className="newapp-header__steps-item__triangle"
                    width="23"
                    height="40"
                    viewBox="0 0 23 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                      stroke="#0085FF"
                    />
                  </svg>
                </NavLink>
                <NavLink
                  onClick={this.handleClickTab}
                  className={this.itemClass(3)}
                  to={`/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/3`}
                >
                  <svg
                    className="newapp-header__steps-item__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ paddingBottom: 0 }}
                  >
                    <path d="M5 1H12L9.5 6H12L7 15V9H5V1Z" fill="white" />
                  </svg>
                  <span>Actions</span>
                  <svg
                    className="newapp-header__steps-item__triangle"
                    width="23"
                    height="40"
                    viewBox="0 0 23 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                      stroke="#0085FF"
                    />
                  </svg>
                </NavLink>
                <NavLink
                  onClick={this.handleClickTab}
                  className={this.itemClass(4)}
                  to={`/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/4`}
                >
                  <svg
                    className="newapp-header__steps-item__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3C4.59091 3 1.67955 5.07333 0.5 8C1.67955 10.9267 4.59091 13 8 13C11.4091 13 14.3205 10.9267 15.5 8C14.3205 5.07333 11.4091 3 8 3ZM8 11.3333C6.11818 11.3333 4.59091 9.84 4.59091 8C4.59091 6.16 6.11818 4.66667 8 4.66667C9.88182 4.66667 11.4091 6.16 11.4091 8C11.4091 9.84 9.88182 11.3333 8 11.3333ZM8 6C6.86818 6 5.95455 6.89333 5.95455 8C5.95455 9.10667 6.86818 10 8 10C9.13182 10 10.0455 9.10667 10.0455 8C10.0455 6.89333 9.13182 6 8 6Z"
                      fill="white"
                    />
                  </svg>
                  <span>Summary</span>
                  <svg
                    className="newapp-header__steps-item__triangle"
                    width="23"
                    height="40"
                    viewBox="0 0 23 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                      stroke="#0085FF"
                    />
                  </svg>
                </NavLink>
              </div>
            )}
          </div>
          <div className="clear" />
        </div>
        <div
          className="container-table container-content__blue-content"
          style={step === "4" ? { paddingTop: 0 } : {}}
        >
          <Route
            exact
            component={SelectTemplate}
            path="/apps/:appId/newrules/:rulesType/:ruleId/configure/select-template"
          />
          <Route
            exact
            component={RulesShowStep1}
            path="/apps/:appId/newrules/:rulesType/:ruleId/configure/1"
          />
          <Route
            exact
            component={RulesShowStep2}
            path="/apps/:appId/newrules/:rulesType/:ruleId/configure/2"
          />
          <Route
            exact
            component={RulesShowStep3}
            path="/apps/:appId/newrules/:rulesType/:ruleId/configure/3"
          />
          <Route
            exact
            component={RulesShowStep4}
            path="/apps/:appId/newrules/:rulesType/:ruleId/configure/4"
          />
          <Route
            exact
            component={RulesShowStep4}
            path="/apps/:appId/newrules/:rulesType/:ruleId/configure/5"
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    rule: state.butlerRule
  }
}

const mapDispatchToProps = {
  fetchRulesRequest,
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesShow)
