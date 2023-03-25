import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import history from "../../../../history"
import classNames from "classnames"
import DashboardItem from "../../../../components/DashboardItem"
import RulesAnalyzePush from "./RulesAnalyzePush"
import RulesAnalyzeScreen from "./RulesAnalyzeScreen"
import axios from "axios"
import $ from "jquery"
import { fetchButlerRuleRequest } from "../../../../actions/butlerRule"

class RulesAnalyze extends Component {
  state = {
    scrollLeft: 0,
    nextDisabled: false,
    loading: true,
    data: {
      general: {},
      push_stats: {},
      screens: []
    },
    rule: {
      name: "",
      push_action: {
        heading: {},
        text: {}
      },
      screen_action: {}
    }
  };

  componentWillMount() {
    window.scrollTo(0, 0)
  }

  componentDidMount() {
    this.getRule((rule) => {
      this.getData((data) => {
        if (rule.screen_action.active) {
          this.setScrollLeft()
          setTimeout(() => {
            this.detectScrollEnd()
          }, 1000)

          if (this.refs.scrollContainer) {
            this.refs.scrollContainer.addEventListener(
              "wheel",
              this.handleScroll
            )
          }

          if (
            !rule.push_action.active &&
            data.screens.length > 0 &&
            history.location.pathname.indexOf("analyze/push") > -1
          ) {
            const { appId, rulesType, ruleId } = this.props.match.params
            history.push(
              `/apps/${appId}/newrules/${rulesType}/${ruleId}/analyze/screens/${data.screens[0].screen.id}`
            )
          }
        }
      })
    })
  }

  getRule = (cb = () => {}) => {
    const { ruleId } = this.props.match.params

    this.props.fetchButlerRuleRequest(ruleId, ({ results, meta }) => {
      this.setState({ rule: results }, cb.call(this, results))
    })
  };

  getData = (cb = () => {}) => {
    const { ruleId } = this.props.match.params
    axios.get(`/butler/rules/${ruleId}/analyze`).then((response) => {
      const { results } = response.data.data
      this.setState({ data: results, loading: false })
      cb(results)
    })
  };

  setScrollLeft = () => {
    if (this.refs.scrollContainer) {
      this.setState({ scrollLeft: this.refs.scrollContainer.scrollLeft })
      this.detectScrollEnd()
    }
  };

  detectScrollEnd = () => {
    if (this.refs.scrollContainer) {
      const $width = this.refs.scrollContainer.offsetWidth
      const $scrollWidth = $(this.refs.scrollContainer)[0].scrollWidth
      const $scrollLeft = $(this.refs.scrollContainer).scrollLeft()

      if ($scrollWidth - $width === $scrollLeft) {
        this.setState({ nextDisabled: true })
      } else this.setState({ nextDisabled: false })
    }
  };

  menuScrollTo = (scrollLeft) => {
    $(this.refs.scrollContainer)
      .stop()
      .animate({ scrollLeft }, 200, "swing", this.setScrollLeft)
  };

  handleScrollNext = () => {
    this.menuScrollTo(this.refs.scrollContainer.scrollLeft + 300)
  };

  handleScrollPrev = () => {
    this.menuScrollTo(this.refs.scrollContainer.scrollLeft - 300)
  };

  handleScroll = (e) => {
    e.preventDefault()
    e.stopPropagation()
  };

  render() {
    const { scrollLeft, nextDisabled, data, rule, loading } = this.state
    const { general, push_stats, screens } = data
    const { push_action } = rule
    const { appId, rulesType, ruleId } = this.props.match.params
    return (
      <div className="container-content container-content__blue container-content__rules">
        <div className="container-top container-content__blue-header">
          <div className="fl">
            <div className="container-title container-title_withdescription">
              <NavLink
                to={`/apps/${appId}/newrules/${rulesType}`}
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
              <span className="va-middle" id="rule-title">
                {rule.name}
              </span>
            </div>
          </div>
          <div className="clear" />
        </div>
        {loading ? (
          <div className="rules-analytics__content-container">
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
          </div>
        ) : (
          <div className="rules-analytics__content">
            <div className="rules-analytics__content-container">
              <div className="dashboard-group__title">
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
                    d="M1 2C1 1.44772 1.44772 1 2 1H4C4.55228 1 5 1.44772 5 2V4C5 4.55228 4.55228 5 4 5H2C1.44772 5 1 4.55228 1 4V2ZM6 2C6 1.44772 6.44772 1 7 1H9C9.55229 1 10 1.44772 10 2V4C10 4.55228 9.55229 5 9 5H7C6.44772 5 6 4.55228 6 4V2ZM15 2C15 1.44772 14.5523 1 14 1H12C11.4477 1 11 1.44772 11 2V4C11 4.55228 11.4477 5 12 5H14C14.5523 5 15 4.55228 15 4V2ZM1 7C1 6.44772 1.44772 6 2 6H4C4.55228 6 5 6.44772 5 7V9C5 9.55229 4.55228 10 4 10H2C1.44772 10 1 9.55229 1 9V7ZM10 7C10 6.44772 9.55229 6 9 6H7C6.44772 6 6 6.44772 6 7V9C6 9.55229 6.44772 10 7 10H9C9.55229 10 10 9.55229 10 9V7ZM11 7C11 6.44772 11.4477 6 12 6H14C14.5523 6 15 6.44772 15 7V9C15 9.55229 14.5523 10 14 10H12C11.4477 10 11 9.55229 11 9V7ZM5 12C5 11.4477 4.55228 11 4 11H2C1.44772 11 1 11.4477 1 12V14C1 14.5523 1.44772 15 2 15H4C4.55228 15 5 14.5523 5 14V12ZM6 12C6 11.4477 6.44772 11 7 11H9C9.55229 11 10 11.4477 10 12V14C10 14.5523 9.55229 15 9 15H7C6.44772 15 6 14.5523 6 14V12ZM15 12C15 11.4477 14.5523 11 14 11H12C11.4477 11 11 11.4477 11 12V14C11 14.5523 11.4477 15 12 15H14C14.5523 15 15 14.5523 15 14V12Z"
                    fill="#97ADC6"
                  />
                </svg>
                <span>General</span>
              </div>
              <div className="pushrules-analyze__row">
                <div className="rules-analyze__box mt10">
                  <DashboardItem
                    title="Rule performed"
                    value={general.performed}
                    prefix=""
                    autorenews={false}
                    tipTitle="Rule performed"
                    tipDescription="Number of times the rule was performed to users. Please note, that the rule can be performed several times for each user."
                    tipButtonUrl=""
                    loading={false}
                  />
                </div>
              </div>
            </div>
            {(rule.push_action.active ||
              (rule.screen_action.active && screens.length > 0)) && (
              <div className="rules-analytics__actions">
                <div className="dashboard-group__title rules-analytics__action-title">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 1H12L9.5 6H12L7 15V9H5V1Z" fill="#97ADC6" />
                  </svg>
                  <span>Actions</span>
                </div>
                <div className="rules-analytics__actions-navigation">
                  <div
                    className={
                      "rules-analytics__actions-navigation__item " +
                      (scrollLeft === 0 &&
                        " rules-analytics__actions-navigation__item_disabled")
                    }
                    onClick={this.handleScrollPrev}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 6.5L9.5 12L15 17.5"
                        stroke="#0085FF"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div
                    className={
                      "rules-analytics__actions-navigation__item " +
                      (nextDisabled &&
                        " rules-analytics__actions-navigation__item_disabled")
                    }
                    onClick={this.handleScrollNext}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.5 6.5L15 12L9.5 17.5"
                        stroke="#0085FF"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  ref="scrollContainer"
                  className="container-content__blue-header container-content__blue-header_menu container-content__blue-header_rules"
                >
                  <div className="container-header-menu container-header-menu_rules">
                    {rule.push_action.active && (
                      <NavLink
                        to={`/apps/${appId}/newrules/${rulesType}/${ruleId}/analyze/push`}
                        activeClassName="container-header-menu__item_active"
                        className="container-header-menu__item"
                      >
                        Push notification
                      </NavLink>
                    )}
                    {rule.screen_action.active &&
                      screens.map((screen, index) => (
                        <NavLink
                          key={index}
                          to={`/apps/${appId}/newrules/${rulesType}/${ruleId}/analyze/screens/${screen.screen.id}`}
                          activeClassName="container-header-menu__item_active"
                          className="container-header-menu__item"
                        >
                          {screen.screen.name}
                        </NavLink>
                      ))}
                  </div>
                </div>
                <div className="rules-analytics__actions-content rules-analytics__content-container">
                  <Route
                    exact
                    render={(props) => (
                      <RulesAnalyzePush
                        {...props}
                        pushStats={push_stats}
                        pushAction={push_action}
                      />
                    )}
                    path="/apps/:appId/newrules/:rulesType/:ruleId/analyze/push"
                  />
                  <Route
                    exact
                    render={(props) => (
                      <RulesAnalyzeScreen {...props} screens={screens} />
                    )}
                    path="/apps/:appId/newrules/:rulesType/:ruleId/analyze/screens/:screenId"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {
  fetchButlerRuleRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesAnalyze)
