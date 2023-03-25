import React, { Component } from "react"
import { connect } from "react-redux"
import history from "../../../../history"
import classNames from "classnames"
import axios from "axios"
import moment from "react-moment"
import titleize from "titleize"
import {
  generateTriggersForFrontend,
  generateSegmentsForFrontend,
  convertSeconds
} from "../../../../libs/helpers"
import ScreensConfiguredItem from "../../Screens/ScreensConfiguredItem"
import Liquid from "liquidjs"
import RulesConfirmsModal from "../RulesConfirmsModal"
import RulesTestModal from "../RulesTestModal"
import PushPreview from "../../../Common/PushPreview"
import ResultModal from "../../../Common/ResultModal"
import LanguageCustomSelect from "../../../Common/LanguageCustomSelect"
import Filters from "../../../Common/Filters/Filters"
import Aux from "../../../../hoc/Aux"

import { fetchButlerRuleRequest } from "../../../../actions/butlerRule"

const engine = new Liquid()

class RulesShowStep4 extends Component {
  state = {
    saving: false,
    triggers: [],
    segments: [],
    dictionarySegments: [],
    push_action: {
      active: false,
      heading: {},
      text: {}
    },
    screen_action: {},
    confirmModal: {},
    testModal: {},
    resultModal: {
      title: "",
      description: "",
      open: false
    },
    loading: true
  };

  componentWillMount() {
    window.scrollTo(0, 0)
    this.getRule()
  }

  showResultModal = ({ title, description }) => {
    this.setState({ resultModal: { title, description, show: true } })
  };

  closeResultModal = (redirect = true) => {
    const { appId } = this.props.match.params
    this.setState({ resultModal: { title: "", description: "", show: false } })

    if (!this.closeResultModalWithoutRedirect) { history.push(`/apps/${appId}/newrules/all`) } else this.closeResultModalWithoutRedirect = false
  };

  getScreen = (screen_id) => {
    const { default_locale } = this.props.application

    axios.get(`/screens/${screen_id}`).then((response) => {
      const screen = response.data.data.results

      engine.registerFilter("price", () => {
        return "x.xx USD"
      })
      const {
        html,
        css,
        data,
        id,
        background_color,
        font,
        background_image,
        schema
      } = screen
      const cssCode = `<style>${css}</style>`

      for (const schemaItem of schema) {
        if (schemaItem.collection) {
          for (const field of schemaItem.fields) {
            if (["text", "textarea"].indexOf(field.type) > -1) {
              for (const dataItem of data[schemaItem.slug]) {
                if (dataItem[field.id].constructor === Object) { dataItem[field.id] = dataItem[field.id][default_locale] }
              }
            }
          }
        } else {
          for (const field of schemaItem.fields) {
            if (["text", "textarea"].indexOf(field.type) > -1) {
              if (data[schemaItem.slug][field.id].constructor === Object) {
                data[schemaItem.slug][field.id] =
                  data[schemaItem.slug][field.id][default_locale]
              }
            }
          }
        }
      }

      engine
        .parseAndRender(
          html + cssCode,
          Object.assign({}, data, {
            screen: { id, background_color, font, background_image }
          })
        )
        .then((compiledHtml) => {
          engine.parseAndRender(compiledHtml).then((compiledHtml) => {
            screen.html = compiledHtml
            this.setState({ screen })
          })
        })
    })
  };

  handleChangeLanguage = ({ code }) => {
    this.setState({ language: code })
  };

  getRule = () => {
    const { ruleId } = this.props.match.params
    const { default_locale } = this.props.application

    this.props.fetchButlerRuleRequest(ruleId, ({ results, meta }) => {
      const rule = results
      const headingKeys = Object.keys(rule.push_action.heading)

      if (rule.screen_action.active && rule.screen_action.screen_uid) { this.getScreen(rule.screen_action.screen_uid) }

      for (const event of meta.events.value) {
        for (const prop of event.properties) {
          prop.items = JSON.parse(JSON.stringify(prop.options))
          delete prop.options
        }
      }

      for (const segment of meta.segments) {
        segment.items = segment.options
        delete segment.options
      }

      if (rule.perform_in !== null) { rule.perform_in = convertSeconds(rule.perform_in) }

      if (headingKeys.length > 0) rule.language = headingKeys[0]
      else rule.language = default_locale

      rule.segments = generateSegmentsForFrontend(rule.segments, meta.segments)
      rule.triggers = generateTriggersForFrontend(rule.triggers, meta)

      setTimeout(() => {
        this.setState({ loading: false })
      }, 500)

      this.setState({ ...results, dictionarySegments: meta.segments })
    })
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
        confirmButtonText,
        cancelButtonText,
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
        cancelButtonText: "",
        onConfirm: () => {},
        onCancel: () => {},
        show: false
      }
    })
  };

  performRule = () => {
    const { appId } = this.props.match.params
    const { id } = this.state

    return axios.post(`/butler/rules/${id}/perform`)
  };

  handleSubmit = () => {
    const { appId } = this.props.match.params
    const {
      id,
      status,
      kind,
      perform_at,
      push_action,
      screen_action
    } = this.state
    const app = this.props.application
    const { user } = this.props

    if (status !== "draft") {
      history.push(`/apps/${appId}/newrules/all`)
      return
    }

    if (kind === "scheduled" && perform_at !== null) {
      const diff = moment(perform_at, "YYYY-MM-DD HH:mm").diff(
        moment().subtract(24, "hours"),
        "s"
      )

      if (diff <= 0) {
        this.closeResultModalWithoutRedirect = true
        this.showResultModal({
          title: "Can not enable rule",
          description: `Rule perform date and time should be later than ${moment()
            .subtract(24, "hours")
            .format("MMM D, HH:mm")}`
        })
        return
      }
    }

    this.setState({ saving: true })

    axios.post(`/butler/rules/${id}/run`).then(
      () => {
        if (window.analytics) {
          window.segmentHelper.identify(
            user.id,
            {
              rule_enabled: true
            },
            {
              integrations: {
                All: true,
                Webhooks: false
              }
            }
          )

          window.analytics.track("rule_enabled", {
            id,
            status,
            kind,
            screen_action_enabled: screen_action.active,
            push_action_enabled: push_action.active,
            email: user.email,
            app_id: app.id,
            app_name: app.name,
            app_appstore_id: app.appstore_app_id
          })
        }

        if (kind === "manual") {
          this.showConfirmModal({
            type: "trigger",
            title: "Perform now?",
            description:
              "Do you want to perform this rule? This will be done immediately.",
            confirmButtonText: "Perform now",
            cancelButtonText: "Perform later",
            onConfirm: () => {
              this.performRule().then(() => {
                this.closeConfirmModal()
                this.showResultModal({ title: "Rule performed" })
              })
            },
            onCancel: () => {
              history.push(`/apps/${appId}/newrules/all`)
            }
          })
        } else {
          history.push(`/apps/${appId}/newrules/all`)
        }
      },
      () => {
        this.setState({ saving: false })
      }
    )
  };

  handleBack = () => {
    const { appId, rulesType, ruleId } = this.props.match.params
    history.push(`/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/3`)
  };

  saveButtonText = () => {
    const { status, kind } = this.state

    if (status === "draft") {
      if (kind === "manual") return "Done"
      else return "Enable"
    } else return "Done"
  };

  render() {
    const { application, match } = this.props
    const { appId } = match.params
    const {
      saving,
      name,
      kind,
      perform_at,
      perform_in,
      triggers,
      segments,
      dictionarySegments,
      once_per_customer,
      language,
      push_action,
      screen_action,
      screen,
      confirmModal,
      status,
      resultModal,
      loading
    } = this.state

    return (
      <div className="rules-result__container">
        <div className="rules-result__line" />
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
          <Aux>
            <div className="rules-result__left">
              <div className="rules-result__left-row">
                <div className="rules-result__left-row__title">Template</div>
                <div className="rules-result__left-row__desc">{name}</div>
              </div>
              <div className="rules-result__left-row">
                <div className="rules-result__left-row__title">Type</div>
                <div className="rules-result__left-row__desc capitalize">
                  {kind}
                </div>
              </div>
              {perform_at && (
                <div className="rules-result__left-row">
                  <div className="rules-result__left-row__title">
                    Perform at
                  </div>
                  <div className="rules-result__left-row__desc uppercase">
                    {moment(perform_at, "YYYY-MM-DD HH:mm").format(
                      "MMM DD, Y, "
                    )}
                    {moment(perform_at, "YYYY-MM-DD HH:mm").format("HH:mm")}
                  </div>
                </div>
              )}
              {triggers.length > 0 && (
                <div className="rules-result__left-row">
                  <div className="rules-result__left-row__title">
                    Perform if
                  </div>
                  {triggers.map((trigger, index) => (
                    <div
                      key={index}
                      className="rules-result__left-row__desc rules-result__left-row__desc_10"
                    >
                      <div className="rules-result__left-row__desc">
                        {triggers[index - 1] ? "OR " : ""}
                        {titleize(trigger.name).replace(/_/g, " ")}
                        {trigger.filters.length > 0 ? ", where:" : ""}
                      </div>
                      <div>
                        <Filters
                          separator="AND"
                          filterTitle="Where"
                          addButtonTitle="Where"
                          modalTitle="Add condition"
                          filters={trigger.filters}
                          dictionaryFilters={trigger.properties}
                          readOnly={true}
                          handleChangeFilters={() => {}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="rules-result__left-row">
                <div className="rules-result__left-row__title">Perform</div>
                {perform_in ? (
                  <div className="rules-result__left-row__desc">
                    After delay: {perform_in.days > 0 && perform_in.days + " d"}{" "}
                    {perform_in.hours > 0 && perform_in.hours + " h"}{" "}
                    {perform_in.minutes > 0 && perform_in.minutes + " min"}
                  </div>
                ) : (
                  <div className="rules-result__left-row__desc">
                    Immediately
                  </div>
                )}
              </div>
              <div className="rules-result__left-row">
                <div className="rules-result__left-row__title">
                  How many times can be performed per user
                </div>
                {once_per_customer ? (
                  <div className="rules-result__left-row__desc">Just once</div>
                ) : (
                  <div className="rules-result__left-row__desc">Unlimited</div>
                )}
              </div>
              <div className="rules-result__left-row">
                <div className="rules-result__left-row__title">
                  User segments
                </div>
                {segments.length > 0 ? (
                  <Filters
                    separator="AND"
                    modalTitle="Add user segment"
                    filterTitle="User property"
                    addButtonTitle="Segment"
                    destroyable={true}
                    readOnly={true}
                    filters={segments}
                    dictionaryFilters={dictionarySegments}
                    handleChangeFilters={() => {}}
                  />
                ) : (
                  <div className="rules-result__left-row__desc">
                    For all users
                  </div>
                )}
              </div>
            </div>
            {(push_action.active || screen_action.active) && (
              <div className="rules-result__right">
                <div className="container-content__integrations-settings__content-title rules-section__subtitle rules-section__subtitle_mb">
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
                {push_action.active && (
                  <div className="rules-result__right-actions__item">
                    <div className="rules-result__right-actions__item-header">
                      <span className="rules-result__right-actions__item-header__title">
                        Send Push notification
                      </span>
                      <div className="fr">
                        <LanguageCustomSelect
                          appId={appId}
                          value={language}
                          onChange={this.handleChangeLanguage}
                          disableInvalidIcon={true}
                        />
                      </div>
                    </div>
                    <div className="rules-result__right-actions__item-content">
                      <PushPreview
                        title={push_action.heading[language]}
                        text={push_action.text[language]}
                        appIconUrl={application.icon_url}
                        appTitle={application.name}
                      />
                    </div>
                  </div>
                )}
                {screen_action.active && screen && (
                  <div className="rules-result__right-actions__item">
                    <div className="rules-result__right-actions__item-header">
                      <span className="rules-result__right-actions__item-header__title">
                        Present a screen when the app becomes active
                      </span>
                    </div>
                    <div className="rules-result__right-actions__item-content">
                      <ScreensConfiguredItem
                        options={false}
                        screen={screen}
                        remove={() => {}}
                        appId={appId}
                        viewOnly={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {confirmModal.show && (
              <RulesConfirmsModal
                type={confirmModal.type}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmButtonText={confirmModal.confirmButtonText}
                cancelButtonText={confirmModal.cancelButtonText}
                onConfirm={confirmModal.onConfirm}
                onCancel={confirmModal.onCancel}
                close={this.closeConfirmModal}
              />
            )}
            {resultModal.show && (
              <ResultModal
                title={resultModal.title}
                description={resultModal.description}
                close={this.closeResultModal}
                onConfirm={this.closeResultModal}
              />
            )}
          </Aux>
        )}
        <div className="rules-bottom__panel">
          <button
            onClick={this.handleBack}
            className="button button_160 button_blue button_icon rules-bottom__panel-button"
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
            <span>Back</span>
          </button>
          <button
            disabled={saving}
            onClick={this.handleSubmit}
            className="button button_160 button_green button_icon"
          >
            <span>{this.saveButtonText()}</span>
          </button>
        </div>
        <div className="clear" />
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
  fetchButlerRuleRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesShowStep4)
