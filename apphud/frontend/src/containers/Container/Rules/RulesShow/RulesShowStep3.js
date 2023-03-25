import React, { Component } from "react"
import { connect } from "react-redux"
import history from "../../../../history"
import classNames from "classnames"
import ScreensConfiguredItem from "../../Screens/ScreensConfiguredItem"
import LanguageCustomSelect from "../../../Common/LanguageCustomSelect"
import PushCertificateUploader from "../../../Common/PushCertificateUploader"
import ScreensBuilder from "../../Screens/ScreensBuilder"
import PushPreview from "../../../../containers/Common/PushPreview"
import RuleNavigation from "../../../../components/Common/RuleNavigation"
import { NotificationManager } from "../../../../libs/Notifications"
import axios from "axios"
import { NavLink } from "react-router-dom"
import Modal from "react-modal"
import { fetchButlerRuleRequest } from "../../../../actions/butlerRule"
import { fetchApplicationRequest } from "../../../../actions/application"

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
    width: 505
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

const filterScreens = (screens, kinds) => {
  if (kinds.length > 0) { return screens.filter((s) => kinds.indexOf(s.kind) > -1) } else return screens
}

class RulesShowStep3 extends Component {
  state = {
    push_action: {
      active: false,
      heading: {},
      text: {}
    },
    screen_action: {
      active: false
    },
    language: "",
    screensBuilder: false,
    screens: [],
    pushCertificateUploaderOpen: false,
    loading: true
  };

  componentDidMount() {
    window.scrollTo(0, 0)
    this.getAppScreens()
    this.props.fetchApplicationRequest(
      this.props.match.params.appId,
      this.getRule
    )
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
    delete params.appScreensLoading
    delete params.language
    delete params.screens
    delete params.screensBuilder
    delete params.pushCertificateUploaderOpen
  };

  hasUnsavedChanges = () => {
    const state = JSON.parse(JSON.stringify(this.state))
    this.removeFields(state)
    this.removeFields(this.beginState)

    return JSON.stringify(this.beginState) !== JSON.stringify(state)
  };

  getRule = ({ default_locale }) => {
    const { ruleId } = this.props.match.params

    this.props.fetchButlerRuleRequest(ruleId, ({ results, meta }) => {
      setTimeout(() => {
        this.setState({ loading: false })
      }, 500)
      const headingKeys = Object.keys(results.push_action.heading)

      if (headingKeys.length > 0) results.language = headingKeys[0]
      else results.language = default_locale

      this.setState(results, () => {
        this.beginState = JSON.parse(JSON.stringify(this.state))
      })
    })
  };

  pushCertificateUploaderClose = () => {
    this.setState({ pushCertificateUploaderOpen: false })
  };

  handleChangePushNotification = () => {
    const { push_action } = this.state
    const { application } = this.props

    if (
      !push_action.active &&
      Object.keys(push_action.text).length === 0 &&
      push_action.text.constructor === Object
    ) {
      this.setState({
        push_action: Object.assign(push_action, {
          text: { [application.default_locale]: "" }
        })
      })
    }

    if (!push_action.active && !application.apns_auth_key) {
      this.setState({ pushCertificateUploaderOpen: true })
    } else {
      this.setState({
        push_action: Object.assign(push_action, {
          active: !push_action.active
        })
      })
    }
  };

  handleChangePresentScreen = () => {
    this.setState({
      screen_action: Object.assign(this.state.screen_action, {
        active: !this.state.screen_action.active
      })
    })
  };

  handleChangeLanguage = ({ code }) => {
    const rule = this.state

    if (!rule.push_action.heading[code]) rule.push_action.heading[code] = ""

    if (!rule.push_action.text[code]) rule.push_action.text[code] = ""

    this.setState({ ...rule, language: code })
  };

  handleHeadingChanged = ({ target }) => {
    const { language } = this.state
    const rule = this.state
    rule.push_action.heading[language] = target.value
    this.setState(rule)
  };

  handleTextChanged = ({ target }) => {
    const { language } = this.state
    const rule = this.state
    rule.push_action.text[language] = target.value
    this.setState(rule)
  };

  inputPushTextClasses = () => {
    const { submitted, push_action, language } = this.state
    return classNames(
      "input input_blue input_stretch purchase-screen__textarea",
      {
        input_error:
          submitted &&
          this.pushTextValid().invalidLanguages.indexOf(language) > -1 &&
          !this.pushTextValid().valid
      }
    )
  };

  getAppScreens = () => {
    this.setState({ appScreensLoading: true })

    axios
      .get(`/apps/${this.props.match.params.appId}/screens`)
      .then((response) => {
        const screens = response.data.data.results
          .filter((s) => s.status === "active")
          .filter((s) => s.version === "v2")
        this.setState({ screens, appScreensLoading: false })
      })
  };

  handleSelectScreen = (screen_id) => {
    this.setState({
      screen_action: Object.assign(this.state.screen_action, { screen_id })
    })
  };

  updateRule = (cb, onError = () => {}) => {
    const { ruleId } = this.props.match.params
    this.setState({ saving: true })
    const params = JSON.parse(JSON.stringify(this.state))
    this.removeFields(params)

    axios
      .put(`/butler/rules/${ruleId}`, params)
      .then(() => {
        cb()
        this.setState({ saving: false })
      })
      .catch(() => {
        onError()
        this.setState({ saving: false })
      })
  };

  pushTextValid = () => {
    const { push_action } = this.state
    const invalidLanguages = []
    let count = 0

    for (const key of Object.keys(push_action.text)) {
      if (push_action.text[key]) count++
      else {
        invalidLanguages.push(key)
      }
    }

    return {
      valid: Object.keys(push_action.text).length === count,
      invalidLanguages
    }
  };

  valid = () => {
    const { push_action, screen_action } = this.state
    let valid = true

    if (push_action.active) {
      if (!this.pushTextValid().valid) valid = false
    }

    if (!push_action.active && !screen_action.active) {
      valid = false
      NotificationManager.error(
        "Error: Configure at least one action",
        "Error",
        5000
      )
    }

    return valid
  };

  handleNext = () => {
    const { appId, rulesType, ruleId } = this.props.match.params

    this.setState({ submitted: true })

    if (this.valid()) {
      this.updateRule(() => {
        history.push(
          `/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/4`
        )
      })
    }
  };

  handleBack = () => {
    const { appId, rulesType, ruleId } = this.props.match.params
    history.push(`/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/2`)
  };

  handleCloseScreensBuilder = () => {
    this.setState({ screensBuilder: false }, this.getAppScreens)
  };

  handleOpenScreensBuilder = (screenId) => {
    this.setState({ screensBuilder: true, screenId })
  };

  render() {
    const {
      push_action,
      screen_action,
      language,
      saving,
      appScreensLoading,
      screens,
      screensBuilder,
      screenId,
      pushCertificateUploaderOpen,
      loading,
      invalidLanguages,
      submitted,
      available_screen_kinds
    } = this.state

    const { heading, text } = push_action
    const { screen_id } = screen_action
    const { application } = this.props
    const { appId } = this.props.match.params

    return (
      <div>
        {loading ? (
          <div className="ta-center">
            <div
              className="animated-background timeline-item"
              style={{ width: 788, margin: "0px auto", marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 788, margin: "0px auto", marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 788, margin: "0px auto", marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 788, margin: "0px auto", marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 788, margin: "0px auto", marginTop: 20 }}
            />
          </div>
        ) : (
          <div>
            <div className="container-content__integrations-settings__content-title rules-section__subtitle rules-section__subtitle_mb ta-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 1H12L9.5 6H12L7 15V9H5V1Z" fill="#97ADC6" />
              </svg>
              <span>What to do when rule was performed?</span>
            </div>
            <div className="rules-actions">
              <div className="rules-actions__item">
                <div
                  className="rules-actions__item-header"
                  onClick={this.handleChangePushNotification}
                >
                  <svg
                    className="rules-actions__item-header__icon"
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="64"
                      height="64"
                      rx="16"
                      fill="url(#paint0_linear)"
                    />
                    <rect
                      x="6"
                      y="6"
                      width="52"
                      height="22"
                      rx="6"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <rect
                      x="12"
                      y="12"
                      width="23"
                      height="3"
                      rx="1.5"
                      fill="#0085FF"
                    />
                    <rect
                      x="12"
                      y="19"
                      width="40"
                      height="3"
                      rx="1.5"
                      fill="#0085FF"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="32"
                        y1="0"
                        x2="32"
                        y2="64"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#0094FF" />
                        <stop offset="1" stopColor="#0066FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="rules-actions__item-header__text">
                    <div className="rules-actions__item-header__text-title">
                      Send Push notification
                    </div>
                    <div className="rules-actions__item-header__text-description">
                      Send message to user.
                    </div>
                  </div>
                  <label className="switcher switcher_green fr rules-actions__item-header__switcher">
                    <input
                      id="viewSandbox"
                      onChange={this.handleChangePushNotification}
                      checked={push_action.active}
                      type="checkbox"
                      className="ios-switch green"
                    />
                    <div>
                      <div></div>
                    </div>
                  </label>
                </div>
                {push_action.active && (
                  <div className="rules-actions__item-footer">
                    <div className="rules-actions__item-footer__left">
                      <div className="input-wrapper input-wrapper_first">
                        <LanguageCustomSelect
                          appId={appId}
                          value={language}
                          onChange={this.handleChangeLanguage}
                          invalidLanguages={
                            submitted && this.pushTextValid().invalidLanguages
                          }
                        />
                      </div>
                      <div className="input-wrapper ta-left">
                        <label className="l-p__label" htmlFor="title">
                          Title
                        </label>
                        <input
                          value={heading[language]}
                          onChange={this.handleHeadingChanged}
                          id="title"
                          autoFocus="autofocus"
                          placeholder="My title"
                          type="text"
                          name="title"
                          required=""
                          className="input input_blue input_stretch"
                        />
                      </div>
                      <div className="input-wrapper ta-left">
                        <label className="l-p__label" htmlFor="text">
                          Text
                        </label>
                        <textarea
                          value={text[language]}
                          onChange={this.handleTextChanged}
                          id="text"
                          placeholder="My text"
                          type="text"
                          name="text"
                          required=""
                          className={this.inputPushTextClasses()}
                        />
                      </div>
                    </div>
                    <div className="rules-actions__item-footer__right">
                      <div className="rules-actions__item-footer__right-wrapper">
                        <PushPreview
                          title={heading[language]}
                          text={text[language]}
                          appIconUrl={application.icon_url}
                          appTitle={application.name}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="rules-actions__separator">AND</div>
              <div className="rules-actions__item">
                <div
                  className="rules-actions__item-header"
                  onClick={this.handleChangePresentScreen}
                >
                  <svg
                    className="rules-actions__item-header__icon"
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="64"
                      height="64"
                      rx="16"
                      fill="url(#paint1_linear)"
                    />
                    <mask
                      id="mask0"
                      mask-type="alpha"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="64"
                      height="64"
                    >
                      <rect
                        width="64"
                        height="64"
                        rx="16"
                        fill="url(#paint1_linear)"
                      />
                    </mask>
                    <g mask="url(#mask0)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14 8C10.6863 8 8 10.6863 8 14V64H56V14C56 10.6863 53.3137 8 50 8H43V11C43 12.1046 42.1046 13 41 13H23C21.8954 13 21 12.1046 21 11V8H14Z"
                        fill="#FDF0E8"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24 27C24 24.7909 25.7909 23 28 23H36C38.2091 23 40 24.7909 40 27V35C40 37.2091 38.2091 39 36 39H28C25.7909 39 24 37.2091 24 35V27ZM18 43C18 41.8954 18.8954 41 20 41H44C45.1046 41 46 41.8954 46 43V44C46 45.1046 45.1046 46 44 46H20C18.8954 46 18 45.1046 18 44V43ZM25.5 48C24.6716 48 24 48.6716 24 49.5C24 50.3284 24.6716 51 25.5 51H38.5C39.3284 51 40 50.3284 40 49.5C40 48.6716 39.3284 48 38.5 48H25.5Z"
                        fill="#F7AA67"
                      />
                    </g>
                    <defs>
                      <linearGradient
                        id="paint1_linear"
                        x1="32"
                        y1="0"
                        x2="32"
                        y2="64"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F6921D" />
                        <stop offset="1" stopColor="#EC671D" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear"
                        x1="32"
                        y1="0"
                        x2="32"
                        y2="64"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#F6921D" />
                        <stop offset="1" stopColor="#EC671D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="rules-actions__item-header__text">
                    <div className="rules-actions__item-header__text-title">
                      Present screen{" "}
                      {available_screen_kinds.length > 0
                        ? `(${available_screen_kinds.join(", ")})`
                        : ""}
                    </div>
                    <div className="rules-actions__item-header__text-description">
                      Present screen configured in “Screens” section when app
                      becomes active.
                    </div>
                  </div>
                  <label className="switcher switcher_green fr rules-actions__item-header__switcher">
                    <input
                      id="viewSandbox"
                      onChange={this.handleChangePresentScreen}
                      checked={screen_action.active}
                      type="checkbox"
                      className="ios-switch green"
                    />
                    <div>
                      <div></div>
                    </div>
                  </label>
                </div>
                {screen_action.active && (
                  <div className="rules-actions__item-footer">
                    {screensBuilder && (
                      <ScreensBuilder
                        appId={appId}
                        screenId={screenId}
                        availableKinds={available_screen_kinds}
                        handleCloseScreensBuilder={
                          this.handleCloseScreensBuilder
                        }
                      />
                    )}
                    <div className="rules-actions__item-footer__wrapper">
                      {appScreensLoading && (
                        <div
                          className="animated-background timeline-item"
                          style={{ width: "100%" }}
                        />
                      )}
                      {!appScreensLoading &&
                        filterScreens(screens, available_screen_kinds).map(
                          (screen, index) => (
                            <div
                              className={
                                "rules-actions__item-footer-item " +
                                (screen.db_id === screen_id &&
                                  " rules-actions__item-footer-item_active")
                              }
                              key={index}
                            >
                              <ScreensConfiguredItem
                                key={index}
                                options={false}
                                screen={screen}
                                remove={this.removeScreen}
                                appId={appId}
                                viewOnly={true}
                              />
                              <div className="rules-actions__item-footer-item__menu">
                                <div className="rules-actions__item-footer-item__menu-buttons">
                                  <div
                                    className="rules-actions__item-footer-item__menu-button"
                                    onClick={this.handleSelectScreen.bind(
                                      null,
                                      screen.db_id
                                    )}
                                  >
                                    Select
                                  </div>
                                  <div
                                    className="rules-actions__item-footer-item__menu-button"
                                    onClick={this.handleOpenScreensBuilder.bind(
                                      null,
                                      screen.id
                                    )}
                                  >
                                    Edit
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      {!appScreensLoading && (
                        <div className="ta-center">
                          <button
                            className="button button_green button_icon button_255"
                            onClick={this.handleOpenScreensBuilder.bind(
                              null,
                              "new"
                            )}
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
                                d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 7H12V9H9V12H7V9H4V7H7V4H9V7Z"
                                fill="white"
                              />
                            </svg>
                            <span>Build new screen</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Modal
              isOpen={pushCertificateUploaderOpen}
              onRequestClose={this.pushCertificateUploaderClose}
              ariaHideApp={false}
              style={customStyles}
              contentLabel="Upload Auth Key"
            >
              <div style={{ padding: "20px 30px" }}>
                <div className="newapp-header__title">Upload Push key</div>
                <div className="input-wrapper">
                  <PushCertificateUploader
                    appId={appId}
                    close={this.pushCertificateUploaderClose}
                    onSaveCallback={this.handleChangePushNotification}
                  />
                </div>
              </div>
            </Modal>
          </div>
        )}
        <RuleNavigation
          handleBack={this.handleBack}
          handleNext={this.handleNext}
          saving={saving}
        />
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
  fetchApplicationRequest,
  fetchButlerRuleRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesShowStep3)
