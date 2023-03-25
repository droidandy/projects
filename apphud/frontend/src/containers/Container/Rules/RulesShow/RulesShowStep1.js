import React, { Component } from "react"
import { connect } from "react-redux"
import history from "../../../../history"
import classNames from "classnames"
import axios from "axios"
import Tip from "../../../Common/Tip"
import InputRadio from "../../../Common/InputRadio"
import InputSelect from "../../../Common/InputSelect"
import Filters from "../../../Common/Filters/Filters"
import RuleNavigation from "../../../../components/Common/RuleNavigation"
import moment from "moment"
import { SingleDatePicker, isInclusivelyAfterDay } from "react-dates"
import MaskedInput from "react-text-mask"
import titleize from "titleize"
import {
  generateTriggersForFrontend,
  convertSeconds, track
} from "../../../../libs/helpers"

import { fetchButlerRuleRequest } from "../../../../actions/butlerRule"

const sumValues = (obj) =>
  Object.values(obj).reduce((a, b) => parseInt(a, 10) + parseInt(b, 10))

class RulesShowStep1 extends Component {
  state = {
    name: "",
    loading: true
  };

  fieldClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error: !this.state[field]
    })
  };

  componentDidMount() {
    this.getRule()
    window.scrollTo(0, 0)
    window.updateRule = (cb, onError) => {
      this.setState({ submitted: true })

      if (this.valid()) {
        this.updateRule(cb, onError)
      } else onError()
    }
    window.hasUnsavedChanges = this.hasUnsavedChanges
  }

  removeFields = (params) => {
    delete params.loading
    delete params.saving
    delete params.performAtFocused
  };

  hasUnsavedChanges = () => {
    const state = JSON.parse(JSON.stringify(this.state))
    this.removeFields(state)
    this.removeFields(this.beginState)

    return JSON.stringify(this.beginState) !== JSON.stringify(state)
  };

  getRule = (rule, cb = () => {}) => {
    const { ruleId } = this.props.match.params

    this.props.fetchButlerRuleRequest(ruleId, ({ results, meta }) => {
      // temp hide nonrenew events
      meta.events.value = meta.events.value.filter(
        ({ name }) => name.indexOf("non_renewing_purchase") === -1
      )

      setTimeout(() => {
        this.setState({ loading: false })
      }, 500)

      for (const event of meta.events.value) {
        for (const prop of event.properties) {
          prop.items = JSON.parse(JSON.stringify(prop.options))
          delete prop.options
        }
      }

      if (results.perform_in !== null) { results.perform_in = convertSeconds(results.perform_in) }

      results.triggers = generateTriggersForFrontend(results.triggers, meta)

      this.dictionary = meta
      this.setState(results, () => {
        this.generateEmptyTrigger()
        this.beginState = JSON.parse(JSON.stringify(this.state))
      })
    })
  };

  generateTriggersForBackend = (triggers) => {
    const result = []

    triggers = triggers.filter((trigger) => trigger)

    for (const trigger of triggers) {
      const newTrigger = {
        event_name: trigger.name,
        properties: {}
      }

      if (trigger.hasOwnProperty("id")) {
        newTrigger.id = trigger.id

        if (trigger.hasOwnProperty("destroy")) { newTrigger.destroy = trigger.destroy }
      }

      for (const filter of trigger.filters) { newTrigger.properties[filter.value] = filter.equal }

      result.push(newTrigger)
    }

    return result
  };

  generatePerformInForBackend = (perform_in) => {
    let result = 0

    for (const key of Object.keys(perform_in)) {
      if (key === "days") result += perform_in[key] * 24 * 60 * 60
      if (key === "hours") result += perform_in[key] * 60 * 60
      if (key === "minutes") result += perform_in[key] * 60
    }
    return result
  };

  updateRule = (cb, onError = () => {}) => {
    const { ruleId } = this.props.match.params
    const params = JSON.parse(JSON.stringify(this.state))

    this.setState({ saving: true })
    this.removeFields(params)

    if (params.perform_in !== null) { params.perform_in = this.generatePerformInForBackend(params.perform_in) }
    params.triggers = this.generateTriggersForBackend(params.triggers)

    axios
      .put(`/butler/rules/${ruleId}`, params)
      .then(() => {
        cb()
        this.setState({ saving: false })
        track("rule_created", params);
      })
      .catch(() => {
        this.setState({ saving: false })
        onError()
      })
  };

  handleChangeKind = ({ target }) => {
    const { status } = this.state

    if (status === "draft") this.setState({ kind: target.value })
  };

  onChangeTrigger = (item, index) => {
    this.setState((state) => {
      const triggers = state.triggers
      triggers[index] = JSON.parse(JSON.stringify(item))
      triggers[index].filters = []
      return { triggers }
    }, this.generateEmptyTrigger)
  };

  generateEmptyTrigger = () => {
    const { triggers } = this.state

    if (triggers[triggers.length - 1] !== null) {
      triggers.push(null)
      this.setState({ triggers })
    }
  };

  removeTrigger = (index) => {
    this.setState((state) => {
      const triggers = state.triggers

      if (triggers[index].hasOwnProperty("id")) triggers[index].destroy = true
      else triggers.splice(index, 1)

      return { triggers }
    })
  };

  handleChangeFilters = (index, filters) => {
    this.setState((state) => {
      const triggers = state.triggers
      triggers[index].filters = filters

      return { triggers }
    })
  };

  handleChangePerformIn = ({ target }) => {
    if (JSON.parse(target.value)) {
      this.setState({
        perform_in: {
          days: "0",
          hours: "0",
          minutes: "1"
        }
      })
    } else this.setState({ perform_in: null })
  };

  handleBlurDelay = (type, { target }) => {
    if (this.state.perform_in[type] === "") {
      this.setState({
        perform_in: Object.assign(this.state.perform_in, { [type]: "0" })
      })
    }
  };

  handleChangeDelay = (type, { target }) => {
    const max = target.getAttribute("max").length || 3
    const value = target.value.slice(0, max)

    if (type === "days" && parseInt(value, 10) > 31) return
    if (type === "hours" && parseInt(value, 10) > 23) return
    if (type === "minutes" && parseInt(value, 10) > 59) return

    this.setState({
      perform_in: Object.assign(this.state.perform_in, { [type]: value })
    })
  };

  handleChangeName = ({ target }) => {
    this.setState({ name: target.value })
  };

  onFocusChange = ({ focused }) => {
    this.setState({ performAtFocused: focused })
  };

  timeMask(value) {
    const chars = value.split("")
    const hours = [/[0-2]/, chars[0] === "2" ? /[0-3]/ : /[0-9]/]

    const minutes = [/[0-5]/, /[0-9]/]

    return hours.concat(":").concat(minutes)
  }

  validateTime = (value) => {
    return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/gm.test(value)
  };

  handleChangePerformAt = (date) => {
    let { perform_at } = this.state

    if (perform_at) {
      const setParams = {
        year: date.year(),
        month: date.month(),
        date: date.date()
      }
      perform_at = moment(perform_at, "YYYY-MM-DD HH:mm")
        .set(setParams)
        .format("YYYY-MM-DD HH:mm:ss")
      this.setState({ perform_at })
    } else this.setState({ perform_at: date.format("YYYY-MM-DD HH:mm:ss") })
  };

  blurPerformAtTime = () => {
    this.setState({ perform_at: this.state.perform_at })
  };

  handleChangePerformAtTime = ({ target }) => {
    let { perform_at } = this.state
    const valid = this.validateTime(target.value)

    if (!perform_at) perform_at = moment().format("YYYY-MM-DD HH:mm:ss")

    if (valid) {
      const hour = target.value.split(":")[0]
      const minute = target.value.split(":")[1]
      perform_at = moment(perform_at, "YYYY-MM-DD HH:mm")
        .set({ hour, minute })
        .format("YYYY-MM-DD HH:mm:ss")
      this.setState({ perform_at })
    }
  };

  handleChangeOncePerCustomer = ({ target }) => {
    this.setState({ once_per_customer: JSON.parse(target.value) })
  };

  showPerformAtWarning = () => {
    const { perform_at } = this.state
    const diff = moment(perform_at).diff(moment(), "h")

    return diff < 24
  };

  performAtClasses = () => {
    const { submitted, perform_at } = this.state
    return classNames("input-wrapper input-wrapper_350 ta-left", {
      "rules-performat-wrapper__error":
        submitted &&
        (perform_at === null ||
          moment(perform_at, "YYYY-MM-DD HH:mm").diff(
            moment().subtract(24, "hours"),
            "s"
          ) <= 0)
    })
  };

  performInClasses = () => {
    const { submitted, perform_in } = this.state
    return classNames("input input_blue input_160 input_performin", {
      input_error: submitted && perform_in && sumValues(perform_in) <= 0
    })
  };

  triggerSelectClasses = () => {
    const { submitted, triggers } = this.state
    return classNames(
      "input-select_blue input-select_255 rules-event__select",
      {
        select_error:
          submitted &&
          triggers.filter((trigger) => trigger && !trigger.destroy).length ===
            0
      }
    )
  };

  valid = () => {
    let valid = true
    const { perform_at, kind, name, triggers, perform_in } = this.state

    if (!perform_at && kind === "scheduled") valid = false
    if (perform_at && kind === "scheduled") {
      const diff = moment(perform_at, "YYYY-MM-DD HH:mm").diff(
        moment().subtract(24, "hours"),
        "s"
      )

      if (diff <= 0) valid = false
    }
    if (!name) valid = false
    if (
      triggers.filter((trigger) => trigger && !trigger.destroy).length === 0 &&
      kind === "automated"
    ) { valid = false }

    if (perform_in && sumValues(perform_in) <= 0 && kind === "automated") { valid = false }

    return valid
  };

  handleNext = () => {
    const { appId, rulesType, ruleId } = this.props.match.params

    this.setState({ submitted: true })

    if (this.valid()) {
      this.updateRule(() => {
        history.push(
          `/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/2`
        )
      })
    }
  };

  render() {
    const {
      kind,
      perform_at,
      perform_in,
      once_per_customer,
      performAtFocused,
      triggers,
      name,
      saving,
      status,
      loading
    } = this.state

    return (
      <div>
        {loading ? (
          <div>
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
          <div>
            <div className="input-wrapper input-wrapper_350 ta-left">
              <label className="l-p__label">Rule name</label>
              <div>
                <div className="input-wrapper__required">
                  <input
                    value={name}
                    onChange={this.handleChangeName}
                    id="name"
                    placeholder="My rule"
                    type="text"
                    name="name"
                    required=""
                    className={this.fieldClasses("name")}
                  />
                  <span className="required-label">Required</span>
                </div>
              </div>
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
                  d="M3 6.99997C3 7.55297 3.448 7.99997 4 7.99997H12C12.553 7.99997 13 7.55297 13 6.99997C13 5.98197 12.691 5.03797 12.167 4.24697L13.707 2.70697L12.293 1.29297L10.753 2.83297C9.963 2.30897 9.018 1.99997 8 1.99997C6.982 1.99997 6.038 2.30997 5.247 2.83297L3.707 1.29297L2.293 2.70697L3.833 4.24697C3.31 5.03697 3 5.98197 3 6.99997ZM8 3.99997C9.304 3.99997 10.416 4.83597 10.829 5.99997H5.172C5.584 4.83497 6.696 3.99997 8 3.99997ZM0 9H1H4H12H15H16V10V16H14V11H13V15H11H5H3V11H2V16H0V10V9Z"
                  fill="#97ADC6"
                />
              </svg>
              <span>What type of rule would you like to create?</span>
            </div>
            <div className="input-wrapper">
              <InputRadio
                checked={kind === "manual"}
                label="Manual (coming soon)"
                value="manual"
                onChange={this.handleChangeKind}
                useTip={true}
                // disabled={status !== 'draft'}
                disabled={true}
                tipOptions={{
                  title: "Manual rule",
                  description: "A rule that will be performed manually.",
                  url: ""
                }}
              />
              <InputRadio
                checked={kind === "scheduled"}
                label="Scheduled (coming soon)"
                onChange={this.handleChangeKind}
                value="scheduled"
                useTip={true}
                // disabled={status !== 'draft'}
                disabled={true}
                tipOptions={{
                  title: "Scheduled rule",
                  description:
                    "A rule that will be performed on a certain time.",
                  url: ""
                }}
              />
              <InputRadio
                checked={kind === "automated"}
                label="Automated"
                onChange={this.handleChangeKind}
                value="automated"
                useTip={true}
                disabled={status !== "draft"}
                tipOptions={{
                  title: "Automated rule",
                  description:
                    "Automatically perform a rule to users when certain events happen.",
                  url: ""
                }}
              />
            </div>
            <div className="rules-attention_mt12 input-wrapper_350 ta-left">
              <div className="rules-attention ta-center">
                Attention: you will not be able to change rule type once rule is
                created
              </div>
            </div>
            {kind === "scheduled" && (
              <div>
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
                      d="M9 0H7V7H9V0ZM3.27411 9.63279C2.93295 8.64534 2.90966 7.57584 3.20752 6.57448C3.50537 5.57312 4.1094 4.69022 4.93478 4.04976L3.70869 2.46966C2.55316 3.3663 1.70752 4.60237 1.29052 6.00427C0.87353 7.40617 0.906134 8.90348 1.38376 10.2859C1.86138 11.6683 2.76003 12.8664 3.9535 13.7119C5.14696 14.5574 6.57528 15.0078 8.03787 14.9999C9.50045 14.992 10.9238 14.5261 12.1081 13.6678C13.2923 12.8094 14.1779 11.6017 14.6406 10.2142C15.1032 8.82668 15.1196 7.32911 14.6875 5.9318C14.2554 4.5345 13.3964 3.30765 12.2312 2.42356L11.0223 4.01683C11.8546 4.64832 12.4681 5.52464 12.7768 6.52272C13.0855 7.52079 13.0737 8.59049 12.7433 9.58156C12.4128 10.5726 11.7802 11.4353 10.9343 12.0484C10.0884 12.6615 9.07175 12.9943 8.02705 12.9999C6.98235 13.0056 5.96211 12.6839 5.10964 12.0799C4.25717 11.476 3.61527 10.6202 3.27411 9.63279Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span>When to perform rule?</span>
                </div>
                <div className={this.performAtClasses()}>
                  <label className="l-p__label">Select date and time</label>
                  <div className="single-date__picker-wrapper single-date__picker-wrapper__rules">
                    <SingleDatePicker
                      placeholder="Date"
                      displayFormat="MMM D, YYYY"
                      date={
                        perform_at
                          ? moment(perform_at, "YYYY-MM-DD HH:mm")
                          : perform_at
                      }
                      isOutsideRange={(day) =>
                        !isInclusivelyAfterDay(
                          day,
                          moment().subtract(1, "days")
                        )
                      }
                      onDateChange={this.handleChangePerformAt}
                      focused={performAtFocused}
                      onFocusChange={this.onFocusChange}
                      id="perform_at"
                    />
                  </div>
                  <MaskedInput
                    placeholder="Time"
                    mask={this.timeMask}
                    onFocus={(e) => e.target.select()}
                    value={moment(perform_at, "YYYY-MM-DD HH:mm").format(
                      "HH:mm"
                    )}
                    onChange={this.handleChangePerformAtTime}
                    onBlur={this.blurPerformAtTime}
                    className="input input_stretch input_blue rules-time__input"
                  />
                  <div className="input-wrapper__bottom-text">
                    A rule will be performed in accordance with user time zone
                  </div>
                </div>
                {this.showPerformAtWarning() && (
                  <div className="rules-attention_mt12 input-wrapper_350 ta-left">
                    <div className="rules-attention ta-center">
                      Attention: delivery by time zone requires a 24-hour lead
                      time to ensure delivery.
                    </div>
                  </div>
                )}
              </div>
            )}
            {kind === "automated" && (
              <div>
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
                      d="M9 0H7V7H9V0ZM3.27411 9.63279C2.93295 8.64534 2.90966 7.57584 3.20752 6.57448C3.50537 5.57312 4.1094 4.69022 4.93478 4.04976L3.70869 2.46966C2.55316 3.3663 1.70752 4.60237 1.29052 6.00427C0.87353 7.40617 0.906134 8.90348 1.38376 10.2859C1.86138 11.6683 2.76003 12.8664 3.9535 13.7119C5.14696 14.5574 6.57528 15.0078 8.03787 14.9999C9.50045 14.992 10.9238 14.5261 12.1081 13.6678C13.2923 12.8094 14.1779 11.6017 14.6406 10.2142C15.1032 8.82668 15.1196 7.32911 14.6875 5.9318C14.2554 4.5345 13.3964 3.30765 12.2312 2.42356L11.0223 4.01683C11.8546 4.64832 12.4681 5.52464 12.7768 6.52272C13.0855 7.52079 13.0737 8.59049 12.7433 9.58156C12.4128 10.5726 11.7802 11.4353 10.9343 12.0484C10.0884 12.6615 9.07175 12.9943 8.02705 12.9999C6.98235 13.0056 5.96211 12.6839 5.10964 12.0799C4.25717 11.476 3.61527 10.6202 3.27411 9.63279Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span>When to perform rule?</span>
                </div>
                {triggers.map(
                  (trigger, triggerIndex) =>
                    ((trigger && !trigger.destroy) || trigger === null) && (
                      <div className="input-wrapper ta-left" key={triggerIndex}>
                        <div className="rules-event__left input-select__show-scroll">
                          <label className="l-p__label">
                            {triggerIndex === 0
                              ? "Perform the rule if"
                              : "...or"}
                          </label>
                          <InputSelect
                            name="trigger"
                            value={trigger}
                            onChange={(item) =>
                              this.onChangeTrigger(item, triggerIndex)
                            }
                            isSearchable={false}
                            autoFocus={false}
                            clearable={false}
                            getOptionLabel={({ name }) =>
                              titleize(name).replace(/_/g, " ")
                            }
                            getOptionValue={({ name }) => name}
                            classNamePrefix="input-select"
                            className={this.triggerSelectClasses()}
                            maxMenuHeight={190}
                            placeholder="Select event"
                            options={this.dictionary.events.value}
                          />
                          {trigger !== null && (
                            <button
                              onClick={this.removeTrigger.bind(
                                null,
                                triggerIndex
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
                        <div className="rules-event__right">
                          {trigger !== null && (
                            <Filters
                              separator="AND"
                              filterTitle="Where"
                              addButtonTitle="Where"
                              modalTitle="Add condition"
                              filters={trigger.filters}
                              dictionaryFilters={trigger.properties}
                              handleChangeFilters={(filters) =>
                                this.handleChangeFilters(triggerIndex, filters)
                              }
                            />
                          )}
                        </div>
                      </div>
                    )
                )}
                {/* <div className="container-content__integrations-settings__content-title">
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9 0H3V2H5V3.08296C2.16229 3.55904 0 6.027 0 9C0 12.3137 2.68629 15 6 15C9.31371 15 12 12.3137 12 9C12 7.61347 11.5297 6.33678 10.7399 5.32077L12.0303 4.03033L10.9697 2.96967L9.67923 4.26011C8.91288 3.66439 7.99823 3.25043 7 3.08296V2H9V0ZM4.53033 6.46967L7.03033 8.96967L5.96967 10.0303L3.46967 7.53033L4.53033 6.46967ZM10 9C10 11.2091 8.20914 13 6 13C3.79086 13 2 11.2091 2 9C2 6.79086 3.79086 5 6 5C8.20914 5 10 6.79086 10 9Z" fill="#97ADC6"/>
                  </svg>
                  <span>When to perform rule?</span>
                </div>
                <div className="input-wrapper">
                  <InputRadio
                    checked={perform_in === null}
                    label="Immediately"
                    value={false}
                    onChange={this.handleChangePerformIn}
                    useTip={false}
                  />
                  <InputRadio
                    checked={perform_in !== null}
                    label="After delay"
                    onChange={this.handleChangePerformIn}
                    value={true}
                    useTip={false}
                  />
                </div>
                {perform_in !== null &&
                  <div className="input-wrapper">
                    <label className="l-p__label">Set delay</label>
                    <div className={"input-wrapper__days " + (perform_in.days && perform_in.days.length > 0 && " input-wrapper__hasvalue")}>
                      <input
                        onFocus={(e) => e.target.select()}
                        id="days"
                        value={perform_in.days}
                        onChange={this.handleChangeDelay.bind(null, "days")}
                        onBlur={this.handleBlurDelay.bind(null, "days")}
                        type="number"
                        placeholder="0"
                        min={0}
                        max={9}
                        className={this.performInClasses()}
                      />
                      <label htmlFor="days">d</label>
                    </div>
                    <div className={"input-wrapper__hours " + (perform_in.hours && perform_in.hours.length > 0 && " input-wrapper__hasvalue")}>
                      <input
                        onFocus={(e) => e.target.select()}
                        id="hours"
                        value={perform_in.hours}
                        onChange={this.handleChangeDelay.bind(null, "hours")}
                        onBlur={this.handleBlurDelay.bind(null, "hours")}
                        type="number"
                        placeholder="00"
                        min={0}
                        max={24}
                        className={this.performInClasses()}
                      />
                      <label htmlFor="hours">h</label>
                    </div>
                    <div className={"input-wrapper__minutes " + (perform_in.minutes && perform_in.minutes.length > 0 && " input-wrapper__hasvalue")}>
                      <input
                        onFocus={(e) => e.target.select()}
                        id="minutes"
                        value={perform_in.minutes}
                        onChange={this.handleChangeDelay.bind(null, "minutes")}
                        onBlur={this.handleBlurDelay.bind(null, "minutes")}
                        type="number"
                        placeholder="01"
                        min={0}
                        max={60}
                        className={this.performInClasses()}
                      />
                      <label htmlFor="minutes">min</label>
                    </div>
                  </div>
                */}
              </div>
            )}
            <div className="container-content__integrations-settings__content-title">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    d="M8.00001 12.5C5.51001 12.5 3.50001 10.49 3.50001 8C3.50001 5.51 5.51001 3.5 8.00001 3.5C9.24001 3.5 10.36 4.02 11.17 4.83L9.00001 7H14V2L12.24 3.76C11.15 2.68 9.66001 2 8.00001 2C4.69001 2 2.01001 4.69 2.01001 8C2.01001 11.31 4.69001 14 8.00001 14C10.97 14 13.43 11.84 13.9 9H12.38C11.92 11 10.14 12.5 8.00001 12.5Z"
                    fill="#97ADC6"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>How many times rule can be performed for each user?</span>
            </div>
            <div className="input-wrapper">
              <InputRadio
                checked={once_per_customer === false}
                label="Unlimited times"
                value={false}
                onChange={this.handleChangeOncePerCustomer}
                useTip={true}
                tipOptions={{
                  title: "",
                  description:
                    "A rule can be performed unlimited times per each user",
                  url: ""
                }}
              />
              <InputRadio
                checked={once_per_customer === true}
                label="Just once"
                value={true}
                onChange={this.handleChangeOncePerCustomer}
                useTip={true}
                tipOptions={{
                  title: "",
                  description:
                    "A rule can be performed only once per each user",
                  url: ""
                }}
              />
            </div>
          </div>
        )}
        <RuleNavigation
          handleBack={() => {}}
          backDisabled={true}
          handleNext={this.handleNext}
          saving={saving}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(RulesShowStep1)
