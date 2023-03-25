import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import Aux from "../../../hoc/Aux"
import axios from "axios"
import { NotificationManager } from "../../../libs/Notifications"
import titleize from "titleize"
import Tooltip from "rc-tooltip"
import Moment from "react-moment"
import moment from "moment"
import {isMobile, track} from "../../../libs/helpers"

class RulesItem extends Component {
  state = {
    open: false
  };

  setPosition = () => {
    var rect = this.refs.customselect.getBoundingClientRect()
    var rectmenu = this.refs.menu.getBoundingClientRect()
    this.setState({
      left: rect.x - rectmenu.width + 32,
      top: rect.y + rect.height
    })
  };

  componentWillUnmount() {
    document.body.style.overflow = ""
  }

  getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth
  };

  openRule = (e) => {
    e.preventDefault()

    const { id, appId, match, rulesType } = this.props
    const url = `/apps/${appId}/newrules/${rulesType}/${id}/analyze/push`

    if (e.metaKey || e.ctrlKey) window.open(url, "_blank")
    else history.push(url)
  };

  ruleRequest = (method, action, cb) => {
    const { id, user } = this.props

    axios[method](`/butler/rules/${id}/${action}`).then(cb)
  };

  ruleDelete = (cb) => {
    const {
      showConfirmModal,
      getRules,
      showResultModal,
      id,
      user,
      closeConfirmModal
    } = this.props
    this.close()
    showConfirmModal({
      type: "delete",
      title: "Remove draft?",
      description: "This can not be undone.",
      confirmButtonText: "Remove",
      onConfirm: () => {
        axios.delete(`/butler/rules/${id}`).then(() => {
          closeConfirmModal()
          showResultModal({ title: "Rule removed" })
          getRules()
          this.forceUpdate()
          track("rule_removed", { id });
        })
      }
    })
  };

  close = () => {
    document.querySelectorAll(".rc-tooltip").forEach((node) => {
      node.classList.add("rc-tooltip-hidden")
    })
  };

  disable = () => {
    const {
      showConfirmModal,
      updateRule,
      showResultModal,
      id,
      closeConfirmModal,
      handleChangeRule
    } = this.props
    this.close()
    showConfirmModal({
      type: "disable",
      title: "Disable rule?",
      description:
        "Do you really want to disable this rule? You can enable it later again.",
      confirmButtonText: "Disable rule",
      onConfirm: () => {
        updateRule({ id, state: "disabled" }, ({ data }) => {
          closeConfirmModal()
          handleChangeRule(id, data.data.results)
          showResultModal({ title: "Rule disabled" })
          this.forceUpdate()
          track("rule_disabled", { id });
        })
      }
    })
  };

  enable = () => {
    const {
      showConfirmModal,
      kind,
      perform_at,
      updateRule,
      showResultModal,
      id,
      closeConfirmModal,
      handleChangeRule
    } = this.props
    this.close()

    if (kind === "scheduled" && perform_at !== null) {
      const diff = moment(perform_at, "YYYY-MM-DD HH:mm").diff(
        moment().subtract(24, "hours"),
        "s"
      )

      if (diff <= 0) {
        showResultModal({
          title: "Can not enable rule",
          description: `Rule perform date and time should be later than ${moment()
            .subtract(24, "hours")
            .format("MMM D, HH:mm")}`
        })
        return
      }
    }

    showConfirmModal({
      type: "enable",
      title: "Enable rule?",
      description: "Do you want to enable this rule?",
      confirmButtonText: "Enable rule",
      onConfirm: () => {
        track("rule_enabled", { id });
        updateRule({ id, state: "enabled" }, ({ data }) => {
          closeConfirmModal()
          handleChangeRule(id, data.data.results)
          showResultModal({ title: "Rule enabled" })
          this.forceUpdate()
        })
      }
    })
  };

  trigger = () => {
    this.close()
    this.props.showConfirmModal({
      type: "trigger",
      title: "Perform rule?",
      description:
        "Do you want to trigger this rule? This will be done immediately.",
      confirmButtonText: "Perform now",
      onConfirm: () => {
        this.ruleRequest("post", "perform", () => {
          this.props.closeConfirmModal()
          this.props.showResultModal({ title: "Rule performed" })
          track("rule_test_popup_triggered")
        })
      }
    })
  };

  archive = () => {
    const {
      showConfirmModal,
      showResultModal,
      id,
      closeConfirmModal,
      handleChangeRule
    } = this.props
    this.close()
    showConfirmModal({
      type: "archive",
      title: "Archive rule?",
      description: "You can unarchive this rule later.",
      confirmButtonText: "Archive",
      onConfirm: () => {
        this.ruleRequest("put", "archive", ({ data }) => {
          closeConfirmModal()
          handleChangeRule(id, data.data.results)
          showResultModal({ title: "Rule archived" })
          this.forceUpdate()
          track("rule_archived", { id });
        })
      }
    })
  };

  unarchive = () => {
    const {
      showConfirmModal,
      showResultModal,
      id,
      closeConfirmModal,
      handleChangeRule
    } = this.props
    this.close()
    this.props.showConfirmModal({
      type: "unarchive",
      title: "Unarchive rule?",
      description: "",
      confirmButtonText: "Unarchive",
      onConfirm: () => {
        this.ruleRequest("put", "archive", ({ data }) => {
          closeConfirmModal()
          handleChangeRule(id, data.data.results)
          showResultModal({ title: "Rule unarchived" })
          this.forceUpdate()
        })
      }
    })
  };

  test = () => {
    this.close()
    this.props.showTestModal(this.props.id)
  };

  duplicate = () => {
    const {
      appId,
      getRules,
      showConfirmModal,
      closeConfirmModal,
      showResultModal
    } = this.props
    this.close()
    showConfirmModal({
      type: "duplicate",
      title: "Duplicate rule?",
      description: "",
      confirmButtonText: "Duplicate",
      onConfirm: () => {
        track("rule_duplicated");
        this.ruleRequest("post", `copy?app_id=${appId}`, () => {
          getRules()
          closeConfirmModal()
          showResultModal({ title: "Rule duplicated" })
        })
      }
    });
  };

  overlay = () => {
    const {
      id,
      kind,
      triggers_count,
      perform_at,
      customers_affected,
      triggered_at,
      created_at,
      status,
      state,
      appId,
      match,
      rulesType,
      name,
      getStatus
    } = this.props

    return (
      <div className="custom-select__onhover-popup__menu">
        <div
          ref="menu"
          className="custom-select__outer custom-select__outer_relative"
        >
          {getStatus(this.props) === "archived" ? (
            <div className="custom-select__outer-menu">
              <div
                className="custom-select__outer-menu__item"
                onClick={this.unarchive}
              >
                <svg
                  className="va-middle integrations-customselect__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 2C0.895431 2 0 2.89543 0 4V5H16V4C16 2.89543 15.1046 2 14 2H2ZM15 6H1V12C1 13.1046 1.89543 14 3 14H13C14.1046 14 15 13.1046 15 12V6ZM7 10V12H9V10H11L8 7L5 10H7Z"
                    fill="#1A344B"
                  />
                </svg>
                <span className="custom-select__outer-menu__item-label">
                  Unarchive
                </span>
              </div>
            </div>
          ) : (
            <div className="custom-select__outer-menu">
              {kind === "manual" &&
                ["new", "completed"].indexOf(getStatus(this.props)) > -1 && (
                <div
                  className="custom-select__outer-menu__item"
                  onClick={this.trigger}
                >
                  <svg
                    className="va-middle integrations-customselect__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 1H3V5H7V7H3V15H1V1ZM9.13176 3.01949L8.13176 4.76949C8.04541 4.92058 8 5.0916 8 5.26562V10.6667C8 10.8831 7.92982 11.0936 7.8 11.2667L5.6 14.2001C5.35279 14.5297 5.58798 15.0001 6 15.0001H14C14.412 15.0001 14.6472 14.5297 14.4 14.2001L12.2 11.2667C12.0702 11.0936 12 10.8831 12 10.6667V5.26562C12 5.0916 11.9546 4.92058 11.8682 4.76949L10.8682 3.01949C10.4843 2.34767 9.51565 2.34767 9.13176 3.01949ZM11 6.00006C11 6.55235 10.5523 7.00006 10 7.00006C9.44771 7.00006 9 6.55235 9 6.00006C9 5.44778 9.44771 5.00006 10 5.00006C10.5523 5.00006 11 5.44778 11 6.00006Z"
                      fill="#20BF55"
                    />
                  </svg>
                  <span className="custom-select__outer-menu__item-label text-green">
                      Perform now
                  </span>
                </div>
              )}
              {["scheduled", "automated"].indexOf(kind) > -1 &&
                state === "enabled" &&
                getStatus(this.props) !== "draft" && (
                <div
                  className="custom-select__outer-menu__item"
                  onClick={this.disable}
                >
                  <svg
                    className="va-middle integrations-customselect__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="3" y="3" width="10" height="10" fill="#FF0C46" />
                  </svg>
                  <span className="custom-select__outer-menu__item-label text-red">
                      Disable
                  </span>
                </div>
              )}
              {["scheduled", "automated"].indexOf(kind) > -1 &&
                state === "disabled" &&
                getStatus(this.props) !== "draft" && (
                <div
                  className="custom-select__outer-menu__item"
                  onClick={this.enable}
                >
                  <svg
                    className="va-middle integrations-customselect__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 14V2L12 8L4 14Z" fill="#20BF55" />
                  </svg>
                  <span className="custom-select__outer-menu__item-label text-green">
                      Enable
                  </span>
                </div>
              )}
              {getStatus(this.props) !== "draft" &&
                ((kind === "manual" &&
                  ["new", "completed", "running"].indexOf(
                    getStatus(this.props)
                  ) > -1) ||
                  (kind === "scheduled" &&
                    ["upcoming", "running"].indexOf(getStatus(this.props)) ===
                      -1) ||
                  kind === "automated") && (
                <NavLink
                  to={`/apps/${appId}/newrules/${rulesType}/${id}/analyze/push`}
                  className="custom-select__outer-menu__item"
                >
                  <svg
                    className="va-middle integrations-customselect__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 2V13.5V14H2.5H14V13H3V2H2ZM6 7H4V12H6V7ZM7 8H9V12H7V8ZM12 4H10V12H12V4Z"
                      fill="#1A344B"
                    />
                  </svg>
                  <span className="custom-select__outer-menu__item-label">
                      Analyze
                  </span>
                </NavLink>
              )}
              <NavLink
                to={`/apps/${appId}/newrules/${rulesType}/${id}/configure/1`}
                className="custom-select__outer-menu__item"
              >
                <svg
                  className="va-middle integrations-customselect__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.002 9V7H12.9C12.77 6.362 12.515 5.771 12.167 5.246L12.951 4.462L11.537 3.048L10.752 3.832C10.228 3.486 9.637 3.231 9.001 3.102V2H7.001V3.102C6.364 3.231 5.772 3.486 5.248 3.833L4.465 3.05L3.051 4.464L3.834 5.247C3.486 5.771 3.232 6.363 3.102 7H2V9H3.102C3.232 9.638 3.486 10.229 3.835 10.754L3.051 11.538L4.466 12.951L5.249 12.167C5.774 12.515 6.365 12.77 7.002 12.899V14.001H9.002V12.898C9.639 12.769 10.231 12.513 10.755 12.166L11.539 12.949L12.952 11.535L12.168 10.752C12.515 10.228 12.77 9.637 12.9 9H14.002ZM8 10C6.895 10 6 9.104 6 8C6 6.896 6.895 6 8 6C9.104 6 10 6.896 10 8C10 9.104 9.104 10 8 10Z"
                    fill="#1A344B"
                  />
                </svg>
                <span className="custom-select__outer-menu__item-label">
                  Configure
                </span>
              </NavLink>
              <div
                className="custom-select__outer-menu__item"
                onClick={this.duplicate}
              >
                <svg
                  className="va-middle integrations-customselect__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.5 1C3.11929 1 2 2.11929 2 3.5V11.5H3V3.5C3 2.67157 3.67157 2 4.5 2H11.5V1H4.5ZM6 3C4.89543 3 4 3.89543 4 5V13C4 14.1046 4.89543 15 6 15H12C13.1046 15 14 14.1046 14 13V5C14 3.89543 13.1046 3 12 3H6Z"
                    fill="#1A344B"
                  />
                </svg>
                <span className="custom-select__outer-menu__item-label">
                  Duplicate
                </span>
              </div>
              {getStatus(this.props) !== "draft" && (
                <Aux>
                  <div
                    onClick={this.test}
                    className="custom-select__outer-menu__item"
                  >
                    <svg
                      className="va-middle integrations-customselect__icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9513 7.99933L9.81467 3.726L7.93267 9.37267L4.65467 0.849335L1.97333 7.99933H0V9.99933H3.36L4.67867 6.48334L8.06733 15.2927L10.1853 8.93933L10.7153 9.99933H16V7.99933H11.9513Z"
                        fill="#1A344B"
                      />
                    </svg>
                    <span className="custom-select__outer-menu__item-label">
                      Test
                    </span>
                  </div>
                  <div
                    className="custom-select__outer-menu__item"
                    onClick={this.archive}
                  >
                    <svg
                      className="va-middle integrations-customselect__icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 2C0.895431 2 0 2.89543 0 4V5H16V4C16 2.89543 15.1046 2 14 2H2ZM1 6H15V12C15 13.1046 14.1046 14 13 14H3C1.89543 14 1 13.1046 1 12V6ZM5 8H11V9H5V8Z"
                        fill="#FF0C46"
                      />
                    </svg>
                    <span className="custom-select__outer-menu__item-label text-red">
                      Archive
                    </span>
                  </div>
                </Aux>
              )}
              {getStatus(this.props) === "draft" && (
                <div
                  onClick={this.ruleDelete}
                  className="custom-select__outer-menu__item"
                >
                  <svg
                    className="va-middle integrations-customselect__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 2V1H6V2H2V4H14V2H10Z" fill="#FF0C46" />
                    <path
                      d="M3 5V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V5H3ZM7.5 12.5H6V7.5H7.5V12.5ZM10 12.5H8.5V7.5H10V12.5Z"
                      fill="#FF0C46"
                    />
                  </svg>
                  <span className="custom-select__outer-menu__item-label text-red">
                    Remove
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  };

  render() {
    const {
      id,
      kind,
      triggers_count,
      perform_at,
      customers_affected,
      triggered_at,
      created_at,
      status,
      state,
      appId,
      match,
      rulesType,
      name,
      getStatus
    } = this.props
    return (
      <tr ref="content">
        <td className="rules-table__column1 cp" onClick={this.openRule}>
          <div className="va-middle rules-table__name">{kind}</div>
          <div
            className={`rules-table__status rules-table__status_${getStatus(
              this.props
            )}`}
          >
            {getStatus(this.props)}
          </div>
          {kind === "scheduled" &&
            getStatus(this.props) === "upcoming" &&
            perform_at && (
            <div className="rules-table__subtext">
                Will be performed:&nbsp;
              <br />
              <Moment
                className="uppercase"
                format="MMM DD, HH:mm"
                date={moment(perform_at, "YYYY-MM-DD HH:mm")}
              />
            </div>
          )}
        </td>
        <td
          className="rules-table__column2 cp"
          onClick={this.openRule}
          style={{ width: "45%" }}
        >
          <div className="va-middle column1_rules-name">{name}</div>
        </td>
        <td onClick={this.openRule}>
          <div className="inline-wrapper">{triggers_count}</div>
        </td>
        <td onClick={this.openRule}>
          <div className="inline-wrapper">
            <Moment
              className="uppercase"
              format="MMM DD, Y"
              date={created_at}
            />
          </div>
        </td>
        <td className="rules-table__column-last ta-center">
          <Tooltip
            mouseEnterDelay={0.1}
            placement="bottom"
            trigger={[isMobile() ? "click" : "hover"]}
            overlay={this.overlay()}
          >
            <svg
              className="container-content__integrations-table__menuicon va-middle"
              ref="customselect"
              width="18"
              height="4"
              viewBox="0 0 18 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z"
                fill="#0085FF"
              />
              <path
                d="M9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 0 9 0C7.89543 0 7 0.89543 7 2C7 3.10457 7.89543 4 9 4Z"
                fill="#0085FF"
              />
              <path
                d="M16 4C17.1046 4 18 3.10457 18 2C18 0.89543 17.1046 0 16 0C14.8954 0 14 0.89543 14 2C14 3.10457 14.8954 4 16 4Z"
                fill="#0085FF"
              />
            </svg>
          </Tooltip>
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RulesItem)
