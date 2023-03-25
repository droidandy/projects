import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../../../history"
import Aux from "../../../../../hoc/Aux"
import { uuidv4 } from "../../../../../libs/helpers"
import axios from "axios"

import TextCounter from "../../../../Common/TextCounter"
import InputSelect from "../../../../Common/InputSelect"
import { NotificationManager } from "../../../../../libs/Notifications"

import {
  fetchRuleRequest,
  createRuleRequest,
  updateRuleRequest
} from "../../../../../actions/rule"

class PushRulesConfig extends Component {
  state = {
    loading: true,
    conditions: [],
    languages: [],
    ios_versions: [],
    screens: [],
    rule: {
      active: true,
      options: [],
      name: "",
      question: "",
      rule_condition: "",
      ios_version: "12.2",
      strings: {
        en: "Opting out? Get a 80% discount!"
      }
    }
  };

  getFillData = (cb = () => {}) => {
    axios
      .get(`/apps/${this.props.match.params.appId}/rules/new`)
      .then((response) => {
        const data = response.data.data.results
        let {
          conditions,
          ios_versions,
          languages,
          option_actions,
          default_questions
        } = data
        const { rule } = this.state

        if (this.props.match.params.ruleId === "new") {
          if (this.props.apprules.length > 0) {
            for (const rule of this.props.apprules) {
              conditions = conditions.filter(
                (condition) => condition.name !== rule.rule_condition
              )
            }
          }

          this.handleChangeRuleCondition(conditions[0])
          rule.options = default_questions.map((question) => ({
            option_action: question.action,
            title: question.title,
            feedback_question: "",
            screen_id: "",
            uniqid: uuidv4()
          }))
          this.generateEmptyOption()
        }

        this.setState(
          {
            rule,
            ios_versions,
            languages,
            conditions,
            option_actions,
            default_questions
          },
          () => {
            cb()
          }
        )
      })
  };

  getAppScreens = (cb = () => {}) => {
    this.setState({ appScreensLoading: true })
    axios
      .get(`/apps/${this.props.match.params.appId}/screens`)
      .then((response) => {
        const screens = response.data.data.results
        this.setState({ screens, appScreensLoading: false })
      })
  };

  getOSVersions = () => {
    const versions = this.state.ios_versions
    return versions
      .map((version) => {
        return {
          label: `iOS ${version}+`,
          value: `${version}`
        }
      })
      .filter((version) => parseFloat(version.value) >= 12.2)
  };

  componentDidMount() {
    this.setState({
      loading: true,
      viewMode: this.props.match.params.ruleId !== "new"
    })

    if (this.props.match.params.ruleId !== "new") { document.title = "Apphud | Configure rule" } else document.title = "Apphud | Create rule"

    this.getFillData(() => {
      this.getAppScreens()
      if (this.props.match.params.ruleId !== "new") {
        this.props.fetchRuleRequest(this.props.match.params.ruleId, (rule) => {
          this.setState({ rule, loading: false })
        })
      } else this.setState({ loading: false })
    })
  }

  handleChangeRuleTextProp = (prop, e) => {
    const { rule } = this.state
    if (prop === "question" && e.target.value.length > 80) return
    rule[prop] = e.target.value
    this.setState({ rule })
  };

  handleChangeSurveyProp = (prop, value) => {
    const { rule } = this.state
    rule[prop] = value
    this.setState({ rule })
  };

  generateEmptyOption = () => {
    const { rule } = this.state

    if (
      rule.options.length < 4 &&
      rule.options.filter((option) => option.option_action === "").length === 0
    ) {
      rule.options.push({
        option_action: "",
        title: "",
        feedback_question: "",
        screen_id: ""
      })
      this.setState({ rule })
    }
  };

  handleChangeSurveyOptionField = (index, prop, value) => {
    const { rule } = this.state
    if (prop === "title" && value.length > 30) return
    if (prop === "feedback_question" && value.length > 70) return
    rule.options[index][prop] = value
    this.setState({ rule }, this.generateEmptyOption)
  };

  removeSurveyOption = (index, e) => {
    const { rule } = this.state
    rule.options.splice(index, 1)
    this.setState({ rule }, this.generateEmptyOption)
  };

  handleChangePushText = (e) => {
    const { rule } = this.state
    if (e.target.value.length > 80) return
    rule.strings.en = e.target.value
    this.setState({ rule })
  };

  handleChangeActiveRule = (e) => {
    const { rule } = this.state
    rule.active = e.target.checked
    this.setState({ rule })
  };

  handleChangeOS = (item) => {
    const { rule } = this.state
    rule.ios_version = item.value
    this.setState({ rule })
  };

  handleChangeRuleCondition = (item) => {
    const { rule } = this.state
    rule.rule_condition = item.name

    if (item.name === "billing_issue") {
      rule.strings.en =
        "There was a problem with your subscription renewal. Open to fix the issue."
    } else rule.strings.en = "Opting out? Get a 80% discount!"

    this.setState({ rule })
  };

  handleCreate = () => {
    this.setState({ submitted: true }, () => {
      let { rule } = this.state

      rule = JSON.parse(JSON.stringify(rule))
      rule.options = rule.options.filter(
        (option) => option.option_action !== ""
      )

      const params = {
        ...JSON.parse(JSON.stringify(rule)),
        appId: this.props.match.params.appId,
        options: rule.options
      }

      if (params.rule_condition === "billing_issue") {
        delete params.options
        delete params.question
      }

      if (document.querySelectorAll(".input_error").length === 0) {
        this.props.createRuleRequest(params, () => {
          this.setState({ submitted: false })
          history.push(`/apps/${params.appId}/rules`)
          NotificationManager.success("Rule successfully created", "OK", 5000)
        })
      }
    })
  };

  handleSave = () => {
    this.setState({ submitted: true }, () => {
      let { rule } = this.state

      rule = JSON.parse(JSON.stringify(rule))
      rule.options = rule.options.filter(
        (option) => option.option_action !== ""
      )

      const params = {
        ...JSON.parse(JSON.stringify(rule)),
        appId: this.props.match.params.appId,
        options: rule.options
      }

      if (params.rule_condition === "billing_issue") {
        delete params.options
        delete params.question
      }

      if (document.querySelectorAll(".input_error").length === 0) {
        this.props.updateRuleRequest(params, () => {
          this.setState({ submitted: false })
          NotificationManager.success("Rule successfully saved", "OK", 5000)
        })
      }
    })
  };

  fieldClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && !this.state.rule[field]
    })
  };

  optionFieldClasses = (index, prop) => {
    const emptyOption =
      !this.state.rule.options[index].title &&
      !this.state.rule.options[index].option_action
    return classNames("input input_stretch input_blue", {
      input_error:
        this.state.submitted &&
        !emptyOption &&
        !this.state.rule.options[index][prop]
    })
  };

  optionSelectClasses = (index, prop) => {
    const emptyOption =
      !this.state.rule.options[index].title &&
      !this.state.rule.options[index].option_action
    return classNames("input-select input-select_blue", {
      select_error:
        this.state.submitted &&
        !emptyOption &&
        !this.state.rule.options[index][prop]
    })
  };

  onMenuOpen = (uniqid, e) => {
    this.setState({ [uniqid]: true })
  };

  onMenuClose = (uniqid, e) => {
    this.setState({ [uniqid]: false })
  };

  render() {
    const {
      rule,
      loading,
      conditions,
      languages,
      screens,
      appScreensLoading,
      option_actions,
      viewMode
    } = this.state

    const { options, question } = rule

    return (
      <div className="container-content container-content__white container-content__integrations">
        {loading && (
          <div>
            <div className="animated-background timeline-item" />
            <div className="animated-background timeline-item__row" />
            <div className="animated-background timeline-item__row" />
            <div className="animated-background timeline-item__row" />
            <p>&nbsp;</p>
          </div>
        )}
        {!loading && (
          <Aux>
            <div className="container-content__integrations-settings__content">
              <div className="checkbox-wrapper ms-checkbox">
                <input
                  id="system"
                  onChange={this.handleChangeActiveRule}
                  checked={rule.active}
                  type="checkbox"
                  className="checkbox"
                />
                <label
                  htmlFor="system"
                  title="Open in New Window"
                  className="checkbox-label-wrapper"
                >
                  <div className="checkbox-label checkbox-label_small fl">
                    <svg
                      width="11px"
                      className="icon-check"
                      height="8px"
                      viewBox="0 0 11 8"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <defs></defs>{" "}
                      <g
                        id="Symbols"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <g
                          id="ui/check-on"
                          transform="translate(-3.000000, -4.000000)"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        >
                          {" "}
                          <g id="Shape">
                            {" "}
                            <polyline points="13 5 7 11 4 8"></polyline>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>{" "}
                    </svg>
                  </div>
                  <span className="label-text">Enable this rule</span>
                </label>
              </div>
              <div className="container-content__integrations-settings__content-title">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="1"
                    width="4"
                    height="4"
                    rx="2"
                    fill="#97ADC6"
                  />
                  <rect
                    x="1"
                    y="6"
                    width="4"
                    height="4"
                    rx="2"
                    fill="#97ADC6"
                  />
                  <rect
                    x="1"
                    y="11"
                    width="4"
                    height="4"
                    rx="2"
                    fill="#97ADC6"
                  />
                  <rect x="7" y="2.5" width="7" height="1" fill="#97ADC6" />
                  <rect x="7" y="7.5" width="7" height="1" fill="#97ADC6" />
                  <rect x="7" y="12.5" width="7" height="1" fill="#97ADC6" />
                </svg>
                <span className="capitalize">General</span>
              </div>
              <div className="input-wrapper ta-left">
                <label className="l-p__label">Rule name:</label>
                <div>
                  <div className="input-wrapper__required">
                    <input
                      value={rule.name}
                      onChange={this.handleChangeRuleTextProp.bind(
                        null,
                        "name"
                      )}
                      id="name"
                      placeholder="E.g. My rule"
                      type="text"
                      name="name"
                      required=""
                      className={this.fieldClasses("name")}
                    />
                    <span className="required-label">Required</span>
                  </div>
                </div>
              </div>
              <div className="input-wrapper ta-left">
                <label className="l-p__label">Min iOS version</label>
                <InputSelect
                  isDisabled={viewMode}
                  name="ios_version"
                  value={this.getOSVersions().filter(
                    ({ value }) => value === rule.ios_version
                  )}
                  onChange={this.handleChangeOS}
                  isSearchable={false}
                  autoFocus={false}
                  clearable={false}
                  classNamePrefix="input-select"
                  className="input-select input-select_blue"
                  options={this.getOSVersions()}
                />
              </div>
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
                    d="M11.5858 9.46446L8.05025 13L6.63604 11.5858L9.22183 9L2 9L2 7L9.12132 7L6.63604 4.51471L8.05025 3.1005L11.5858 6.63604L13 8.05025L11.5858 9.46446Z"
                    fill="#97ADC6"
                  />
                </svg>
                <span className="capitalize">Action</span>
              </div>
              <div className="input-wrapper ta-left">
                <label className="l-p__label">
                  Select when to trigger a rule
                </label>
                <InputSelect
                  isDisabled={viewMode}
                  name="rule_condition"
                  value={conditions.filter(
                    ({ name }) => name === rule.rule_condition
                  )}
                  onChange={this.handleChangeRuleCondition}
                  isSearchable={false}
                  autoFocus={false}
                  clearable={false}
                  getOptionLabel={({ label }) => label}
                  getOptionValue={({ name }) => name}
                  classNamePrefix="input-select"
                  className="input-select input-select_blue"
                  options={conditions}
                />
                <div className="input-wrapper__bottom-text">
                  Apphud will display a survey. You may specify a question and
                  options below.
                </div>
              </div>
              <div className="input-wrapper ta-left">
                <label className="l-p__label">
                  Send Push notification with a text
                </label>
                <div className="input-wrapper__counter ta-left">
                  <input
                    disabled={viewMode}
                    value={rule.strings.en}
                    onChange={this.handleChangePushText}
                    id="push_text"
                    placeholder="Push-notification text"
                    type="text"
                    name="push_text"
                    className="input input_stretch input_blue"
                  />
                  <span className="required-label">
                    <TextCounter text={rule.strings.en} max={80} />
                  </span>
                </div>
              </div>
            </div>
            {["trial_canceled", "subscription_canceled"].indexOf(
              rule.rule_condition
            ) > -1 && (
              <div>
                <div className="container-content__integrations-settings__content container-content__integrations-settings__content_mt0">
                  <div className="input-wrapper ta-left">
                    <label className="l-p__label">Survey question</label>
                    <div>
                      <div className="input-wrapper__counter">
                        <input
                          disabled={viewMode}
                          value={question}
                          onChange={this.handleChangeRuleTextProp.bind(
                            null,
                            "question"
                          )}
                          id="poll_question"
                          placeholder="E.g. Why did you cancel a subscription?"
                          type="text"
                          name="poll_question"
                          required=""
                          className={this.fieldClasses("question")}
                        />
                        <span className="required-label">
                          <TextCounter text={question} max={80} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="input-wrapper ta-left">
                  <label className="l-p__label">Survey options</label>
                  <div className="pushrules-content">
                    <div className="pushrules-poll__row">
                      <div className="pushrules-poll__row-column">
                        <span className="pushrules-poll__row-column__title">
                          TITLE
                        </span>
                      </div>
                      <div className="pushrules-poll__row-column">
                        <span className="pushrules-poll__row-column__title">
                          WHAT TO DO?
                        </span>
                      </div>
                      <div className="pushrules-poll__row-column">
                        <span className="pushrules-poll__row-column__title">
                          PARAMETER
                        </span>
                      </div>
                    </div>
                    {options.map((option, index) => (
                      <div key={index} className="pushrules-poll__row">
                        <div className="pushrules-poll__row-column">
                          <div className="input-wrapper__counter">
                            <input
                              disabled={viewMode}
                              value={option.title}
                              onChange={(e) => {
                                this.handleChangeSurveyOptionField(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }}
                              id="option_title"
                              placeholder="Option title"
                              type="text"
                              name="option_title"
                              required=""
                              className={this.optionFieldClasses(
                                index,
                                "title"
                              )}
                            />
                            <span className="required-label">
                              <TextCounter text={option.title} max={30} />
                            </span>
                          </div>
                        </div>
                        <div className="pushrules-poll__row-column">
                          <InputSelect
                            isDisabled={viewMode}
                            name="action"
                            value={option_actions.filter(
                              (surveyAction) =>
                                surveyAction.action === option.option_action
                            )}
                            onChange={(item) => {
                              this.handleChangeSurveyOptionField(
                                index,
                                "option_action",
                                item.action
                              )
                            }}
                            isSearchable={false}
                            autoFocus={false}
                            clearable={false}
                            getOptionLabel={({ label }) => label}
                            getOptionValue={({ action }) => action}
                            classNamePrefix="input-select"
                            placeholder="Select action"
                            className={this.optionSelectClasses(
                              index,
                              "option_action"
                            )}
                            options={option_actions}
                          />
                        </div>
                        <div className="pushrules-poll__row-column">
                          {option.option_action &&
                            option.option_action ===
                              "present_feedback_screen" && (
                            <div className="input-wrapper__counter">
                              <input
                                disabled={viewMode}
                                value={option.feedback_question}
                                onChange={(e) => {
                                  this.handleChangeSurveyOptionField(
                                    index,
                                    "feedback_question",
                                    e.target.value
                                  )
                                }}
                                id="feedback_question"
                                placeholder="Question"
                                type="text"
                                name="feedback_question"
                                required=""
                                className={this.optionFieldClasses(
                                  index,
                                  "feedback_question"
                                )}
                              />
                              <span className="required-label">
                                <TextCounter
                                  text={option.feedback_question}
                                  max={70}
                                />
                              </span>
                            </div>
                          )}
                          {option.option_action &&
                            option.option_action ===
                              "present_purchase_screen" && (
                            <div className="input-select__refresh">
                              {appScreensLoading ? (
                                <div
                                  className="animated-background timeline-item"
                                  style={{ height: 34 }}
                                />
                              ) : (
                                <InputSelect
                                  name="screen"
                                  value={screens.filter(
                                    ({ db_id }) => db_id === option.screen_id
                                  )}
                                  onChange={(item) => {
                                    this.handleChangeSurveyOptionField(
                                      index,
                                      "screen_id",
                                      item.db_id
                                    )
                                  }}
                                  isSearchable={false}
                                  autoFocus={false}
                                  clearable={false}
                                  getOptionLabel={({ name }) => name}
                                  getOptionValue={({ db_id }) => db_id}
                                  placeholder={
                                    screens.length === 0
                                      ? "No screens created"
                                      : "Choose screen"
                                  }
                                  classNamePrefix="input-select"
                                  className={this.optionSelectClasses(
                                    index,
                                    "screen_id"
                                  )}
                                  options={screens}
                                  onMenuOpen={this.onMenuOpen.bind(
                                    null,
                                    option.uniqid
                                  )}
                                  onMenuClose={this.onMenuClose.bind(
                                    null,
                                    option.uniqid
                                  )}
                                  isDisabled={appScreensLoading || viewMode}
                                />
                              )}
                              <div
                                onClick={this.getAppScreens}
                                className={
                                  "link link_normal input-select__refresh-link " +
                                    (this.state[option.uniqid] &&
                                      " input-select__refresh-link_white")
                                }
                                href="https://docs.apphud.com/"
                                target="_blank"
                              >
                                  Refresh
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="pushrules-poll__row-column pushrules-poll__row-column_button">
                          {option.option_action && (
                            <button
                              disabled={viewMode}
                              onClick={this.removeSurveyOption.bind(
                                null,
                                index
                              )}
                              className="button button_red pushrules-content__row-column-3__button"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 3V2H6V3H2V5H14V3H10Z"
                                  fill="white"
                                />
                                <path
                                  d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                                  fill="white"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Aux>
        )}
        <div className="input-wrapper ta-left">
          {this.props.match.params.ruleId === "new" ? (
            <button
              className="button button_green l-p__button"
              onClick={this.handleCreate}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 0C3.1339 0 0 3.1339 0 7C0 10.8661 3.1339 14 7 14C10.8661 14 14 10.8661 14 7C14 3.1339 10.8654 0 7 0ZM6.475 11.025L2.975 8.4L4.025 7L6.125 8.575L9.8 3.675L11.2 4.725L6.475 11.025Z"
                  fill="white"
                />
              </svg>
              <span>Create</span>
            </button>
          ) : (
            <button
              className="button button_green l-p__button"
              onClick={this.handleSave}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 0C3.1339 0 0 3.1339 0 7C0 10.8661 3.1339 14 7 14C10.8661 14 14 10.8661 14 7C14 3.1339 10.8654 0 7 0ZM6.475 11.025L2.975 8.4L4.025 7L6.125 8.575L9.8 3.675L11.2 4.725L6.475 11.025Z"
                  fill="white"
                />
              </svg>
              <span>Save</span>
            </button>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application,
    apprules: state.rules
  }
}

const mapDispatchToProps = {
  fetchRuleRequest,
  createRuleRequest,
  updateRuleRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(PushRulesConfig)
