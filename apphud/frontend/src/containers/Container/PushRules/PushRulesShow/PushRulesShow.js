import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink, Route } from "react-router-dom"

import PushRulesAnalyze from "./PushRulesAnalyze/PushRulesAnalyze"
import PushRulesConfig from "./PushRulesConfig/PushRulesConfig"
import PushRulesTest from "./PushRulesTest/PushRulesTest"

class PushRulesShow extends Component {
  componentDidMount() {
    document.title = "Apphud | Configure rule"
  }

  render() {
    return (
      <div className="container-content container-content__blue container-content__appsettings">
        <div className="container-content__blue-header container-content__blue-header_menu">
          <div className="container-title">
            <NavLink
              to={`/apps/${this.props.match.params.appId}/rules`}
              className="button button_blue newapp-container__button"
            >
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
                  d="M3.41422 6.53554L6.94975 3L8.36396 4.41421L5.77817 7H13V9H5.87868L8.36396 11.4853L6.94975 12.8995L3.41421 9.36396L2 7.94975L3.41422 6.53554Z"
                  fill="white"
                />
              </svg>
            </NavLink>
            <span className="newapp-header__title">
              {this.props.match.params.ruleId === "new"
                ? "Configure Rule"
                : this.props.rule.name}
            </span>
          </div>
          <div className="container-header-menu">
            {this.props.match.params.ruleId !== "new" && (
              <NavLink
                to={`/apps/${this.props.match.params.appId}/rules/${this.props.match.params.ruleId}/analyze`}
                activeClassName="container-header-menu__item_active"
                className="container-header-menu__item"
              >
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
                    d="M2 2V13.5V14H2.5H14V13H3V2H2ZM6 7H4V12H6V7ZM7 8H9V12H7V8ZM12 4H10V12H12V4Z"
                    fill="white"
                  />
                </svg>
                <span>Analyze</span>
              </NavLink>
            )}
            <NavLink
              to={`/apps/${this.props.match.params.appId}/rules/${this.props.match.params.ruleId}/config`}
              activeClassName="container-header-menu__item_active"
              className="container-header-menu__item"
            >
              <svg
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
              <span>Configure</span>
            </NavLink>
            {this.props.match.params.ruleId !== "new" && (
              <NavLink
                to={`/apps/${this.props.match.params.appId}/rules/${this.props.match.params.ruleId}/test`}
                activeClassName="container-header-menu__item_active"
                className="container-header-menu__item"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9513 7.99933L9.81467 3.726L7.93267 9.37267L4.65467 0.849335L1.97333 7.99933H0V9.99933H3.36L4.67867 6.48334L8.06733 15.2927L10.1853 8.93933L10.7153 9.99933H16V7.99933H11.9513Z"
                    fill="white"
                  />
                </svg>
                <span>Test</span>
              </NavLink>
            )}
          </div>
        </div>
        <Route
          exact
          component={PushRulesAnalyze}
          path="/apps/:appId/rules/:ruleId/analyze"
        />
        <Route
          exact
          component={PushRulesConfig}
          path="/apps/:appId/rules/:ruleId/config"
        />
        <Route
          exact
          component={PushRulesTest}
          path="/apps/:appId/rules/:ruleId/test"
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application,
    rule: state.rule
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PushRulesShow)
