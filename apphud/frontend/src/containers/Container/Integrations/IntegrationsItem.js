import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import Aux from "../../../hoc/Aux"
import SweetAlert from "react-swal"
import axios from "axios"
import { NotificationManager } from "../../../libs/Notifications"
import titleize from "titleize"
import Moment from "react-moment"
import Tooltip from "rc-tooltip"
import { isMobile } from "../../../libs/helpers"

class IntegrationsItem extends Component {
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

  close = () => {
    document.querySelectorAll(".rc-tooltip").forEach((node) => {
      node.classList.add("rc-tooltip-hidden")
    })
  };

  handleSendTestEvent = (integration) => {
    const { appId, user, webhook } = this.props
    const testUrl = webhook
      ? `/apps/${appId}/app_hooks/${integration.id}/test`
      : `/apps/${appId}/integrations/${integration.id}/test`

    axios
      .post(testUrl)
      .then((result) => {
        if (result.data.errors && result.data.errors.length > 0) {
          var errors = result.data.errors
            .map((error) => error.id.capitalize() + ": " + error.title)
            .join("\n")
          NotificationManager.error(errors, "OK", 5000)
        } else {
          NotificationManager.success(
            "Test event successfully sent",
            "OK",
            5000
          )
        }
      })
      .catch((_error) => {
        NotificationManager.error("Test event failed", "OK", 5000)
      })
    this.close()
  };

  getEventsTags = (integration) => {
    const defaultProps = []
    let props = Object.keys(integration)

    props = props
      .filter((prop) => {
        return prop.indexOf("_events") > -1 && integration[prop]
      })
      .map((prop) => {
        prop = titleize(prop).replace("_events", "").replace(/_/g, " ")
        return prop
      })

    if (Array.isArray(props)) return props
    else return defaultProps
  };

  remove = () => {
    this.close()
    this.setState({ open: false })
    this.props.remove(this.props.integration)
  };

  overlay = () => {
    const {
      integration,
      integrationActive,
      appId,
      webhook,
      user,
      handleCheckPlan
    } = this.props

    return (
      <div className="custom-select__onhover-popup__menu custom-select__onhover-popup__menu_integrations">
        <div
          ref="menu"
          className="custom-select__outer custom-select__outer_relative"
        >
          <div className="custom-select__outer-menu">
            <NavLink
              onClick={
                integration.available_on_free_plan &&
                user.subscription.plan.free
                  ? () => {}
                  : handleCheckPlan
              }
              onMouseUp={this.close}
              to={
                webhook
                  ? `/apps/${appId}/integrations/webhooks/${integration.id}`
                  : `/apps/${appId}/integrations/${this.props.platform}/edit/${integration.id}`
              }
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
            {(webhook || integration.can_test) && (
              <div
                className="custom-select__outer-menu__item"
                onClick={this.handleSendTestEvent.bind(null, integration)}
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
                    d="M4.12863 8.5C3.89397 8.5 3.6773 8.624 3.5573 8.82267L1.09463 12.9273C0.950633 13.1667 0.972633 13.4727 1.1493 13.69C1.32597 13.9073 1.61997 13.9907 1.8853 13.8993L13.8853 9.79667C14.1926 9.69 14.3786 9.37667 14.3246 9.056C14.2706 8.734 13.9926 8.5 13.6666 8.5H4.12863Z"
                    fill="#1A344B"
                  />
                  <path
                    d="M4.12863 7.5C3.89397 7.5 3.6773 7.376 3.5573 7.17733L1.09463 3.07267C0.950633 2.83333 0.972633 2.52733 1.1493 2.31C1.32597 2.09267 1.61997 2.00933 1.8853 2.10067L13.8853 6.20333C14.1926 6.31 14.3786 6.62333 14.3246 6.944C14.2706 7.266 13.9926 7.5 13.6666 7.5H4.12863Z"
                    fill="#1A344B"
                  />
                </svg>
                <span className="custom-select__outer-menu__item-label">
                  Send test event
                </span>
              </div>
            )}
            <div
              className="custom-select__outer-menu__item"
              onClick={this.remove}
            >
              <svg
                className="va-middle integrations-customselect__icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 3.33267V2H6V3H2V5H14V3.33267H10Z" fill="#FF0C46" />
                <path
                  d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                  fill="#FF0C46"
                />
              </svg>
              <span className="custom-select__outer-menu__item-label text-red">
                Remove
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  };

  overlayMore = () => {
    return (
      <div className="custom-select__onhover-popup__menu custom-select__onhover-popup__menu_integrations">
        <div
          ref="menu"
          className="custom-select__outer custom-select__outer_relative"
        >
          <div className="custom-select__outer-menu custom-select__outer-menu_integrations-more">
            {this.getEventsTags(this.props.integration)
              // .slice(5)
              .map((event, index) => (
                <span className="tag tag_silver tag_integration" key={index}>
                  {event}
                </span>
              ))}
          </div>
        </div>
      </div>
    )
  };

  render() {
    const {
      integration,
      integrationActive,
      appId,
      webhook,
      user,
      handleCheckPlan
    } = this.props

    return (
      <tr>
        <td className="column1_integrations">
          <NavLink
            onClick={
              integration.available_on_free_plan && user.subscription.plan.free
                ? () => {}
                : handleCheckPlan
            }
            to={
              webhook
                ? `/apps/${appId}/integrations/webhooks/${integration.id}`
                : `/apps/${appId}/integrations/${this.props.platform}/edit/${integration.id}`
            }
            className="column-value"
          >
            {webhook ? (
              <svg
                className="va-middle"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <circle cx="12.5" cy="12" r="12" fill="#F6921D" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18 8C18.8284 8 19.5 7.32843 19.5 6.5C19.5 5.67157 18.8284 5 18 5C17.1716 5 16.5 5.67157 16.5 6.5C16.5 6.73157 16.5525 6.95089 16.6462 7.14671L13.516 10.2769C13.2182 10.101 12.8709 10 12.5 10C11.9722 10 11.4921 10.2045 11.1347 10.5385L8.46185 8.83762C8.48681 8.7291 8.5 8.61609 8.5 8.5C8.5 7.67157 7.82843 7 7 7C6.17157 7 5.5 7.67157 5.5 8.5C5.5 9.32843 6.17157 10 7 10C7.34888 10 7.66994 9.88089 7.92474 9.68112L10.5973 11.3819C10.5342 11.5765 10.5 11.7843 10.5 12C10.5 12.3709 10.601 12.7182 10.7769 13.016L7.64671 16.1462C7.45089 16.0525 7.23157 16 7 16C6.17157 16 5.5 16.6716 5.5 17.5C5.5 18.3284 6.17157 19 7 19C7.82843 19 8.5 18.3284 8.5 17.5C8.5 17.2684 8.44752 17.0491 8.35381 16.8533L11.484 13.7231C11.6936 13.8469 11.9278 13.9336 12.1774 13.9741L12.374 16.1365C11.8581 16.3737 11.5 16.895 11.5 17.5C11.5 18.3284 12.1716 19 13 19C13.8284 19 14.5 18.3284 14.5 17.5C14.5 16.7992 14.0194 16.2107 13.3699 16.0459L13.1733 13.8838C13.5227 13.7589 13.8272 13.5396 14.0561 13.2565L16.5056 14.3699C16.5019 14.4128 16.5 14.4562 16.5 14.5C16.5 15.3284 17.1716 16 18 16C18.8284 16 19.5 15.3284 19.5 14.5C19.5 13.6716 18.8284 13 18 13C17.5756 13 17.1923 13.1763 16.9194 13.4596L14.4701 12.3463C14.4898 12.2338 14.5 12.1181 14.5 12C14.5 11.6291 14.399 11.2818 14.2231 10.984L17.3533 7.85381C17.5491 7.94752 17.7684 8 18 8Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <path d="M0.5 0H24.5V24H0.5V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <img
                src={integration.icon}
                className="va-middle"
                alt="service icon"
              />
            )}
            <div className="va-middle column1_integrations-name">
              {integration.title || integration.name}
            </div>
          </NavLink>
        </td>
        <td className="column2 column-long">
          <div className="container-table__column-item">
            {(
              <Tooltip
                mouseEnterDelay={0.1}
                placement="bottom"
                trigger={["click"]}
                overlay={this.overlayMore()}
              >
                { this.getEventsTags(integration).length ? <span className="tag tag_more">
                  {this.getEventsTags(integration).length} event(s)
                </span> :   <span className="tag tag_no-more">
                  {this.getEventsTags(integration).length} event(s)
                </span>}
              </Tooltip>
            )}
          </div>
        </td>
        <td className="column4">
          <label className="switcher">
            <input
              id="integration-active"
              checked={integrationActive}
              onChange={this.props.handleChangeActive.bind(null, integration)}
              type="checkbox"
              className="ios-switch green"
            />
            <div>
              <div></div>
            </div>
          </label>
        </td>
        <td className="column4">
          <Moment format="MMM DD, Y" date={integration.created_at} />
        </td>
        <td className="column5 ta-center column5_center" style={{ width: 120 }}>
          <Tooltip
            mouseEnterDelay={0.1}
            placement="bottom"
            trigger={[isMobile() ? "click" : "hover"]}
            overlay={this.overlay()}
          >
            <div>
              <svg
                className="container-content__integrations-table__menuicon"
                ref="customselect"
                onClick={this.toggleOpen}
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
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationsItem)
