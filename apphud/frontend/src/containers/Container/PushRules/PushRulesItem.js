import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import axios from "axios"
import { NotificationManager } from "../../../libs/Notifications"
import titleize from "titleize"
import Moment from "react-moment"

class PushRulesItem extends Component {
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

  toggleOpen = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        this.setPosition()
        document.body.style.paddingRight = this.getScrollbarWidth() + "px"
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.paddingRight = "0px"
        document.body.style.overflow = ""
      }
    })
  };

  handleSendTestEvent = (rule) => {
    axios
      .post(`/apps/${this.props.appId}/rules/${rule.id}/test`)
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
    this.toggleOpen()
  };

  remove = () => {
    this.toggleOpen()
    this.setState({ open: false })
    this.props.remove(this.props.rule)
  };

  openRule = () => {
    const { rule, appId } = this.props
    history.push(`/apps/${appId}/rules/${rule.id}/analyze`)
  };

  render() {
    const { rule, ruleActive, appId } = this.props
    return (
      <tr>
        <td className="column1_integrations cp" onClick={this.openRule}>
          <div className="va-middle column1_rules-name">{rule.name}</div>
        </td>
        <td className="column2 column-long">
          <div className="inline-wrapper">
            {titleize(rule.rule_condition).replace(/_/g, " ")}
          </div>
        </td>
        <td className="column4">
          <label className="switcher">
            <input
              id="integration-active"
              checked={ruleActive}
              onChange={this.props.handleChangeActive.bind(null, rule)}
              type="checkbox"
              className="ios-switch green"
            />
            <div>
              <div></div>
            </div>
          </label>
        </td>
        <td className="column4">
          <Moment format="MMM DD, Y" date={rule.created_at} />
        </td>
        <td className="column5 ta-center">
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
          {this.state.open && (
            <div
              className="custom-select__onhover-popup__menu"
              style={{ padding: 0, margin: 0 }}
            >
              <div
                className="custom-select__overlay"
                onClick={this.toggleOpen}
              />
              <div
                ref="menu"
                className="custom-select__outer"
                style={{ top: this.state.top, left: this.state.left }}
              >
                <div className="custom-select__outer-menu">
                  <NavLink
                    to={`/apps/${appId}/rules/${rule.id}/analyze`}
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
                  <NavLink
                    to={`/apps/${appId}/rules/${rule.id}/config`}
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
                  <NavLink
                    to={`/apps/${appId}/rules/${rule.id}/test`}
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
                  </NavLink>
                  {/* <div className="custom-select__outer-menu__item" onClick={this.remove}>
                    <svg className="va-middle integrations-customselect__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3.33267V2H6V3H2V5H14V3.33267H10Z" fill="#FF0C46"/>
                      <path d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z" fill="#FF0C46"/>
                    </svg>
                    <span className="custom-select__outer-menu__item-label text-red">Remove</span>
                  </div> */}
                </div>
              </div>
            </div>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PushRulesItem)
