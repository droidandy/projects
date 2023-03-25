import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../../history"
import Aux from "../../../../hoc/Aux"
import { NotificationManager } from "../../../../libs/Notifications"
import axios from "axios"
import filter from "lodash/filter"
import titleize from "titleize"
import Modal from "react-modal"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Tip from "../../../Common/Tip"
import InputRadio from "../../../Common/InputRadio"
import {track, validation} from "../../../../libs/helpers"

class WebhooksShow extends Component {
  state = {
    loading: true,
    saving: false,
    eventsFields: [],
    currentGroup: "Regular",
    webhook: {
      name: "",
      active: false,
      token: "",
      url: "",
      events_environment: "production",
      enable_ssl_verification: true,
      properties: {}
    }
  };

  componentDidMount() {
    const newWebhook = this.props.match.params.webhookId === "new"

    this.getRequest((eventsFields) => {
      if (newWebhook) {
        const { webhook } = this.state

        for (const field of eventsFields) {
          webhook[field.name + "_events"] = true
        }

        this.setState({ webhook, eventsFields })
      } else this.setState({ eventsFields })
    }, true)

    if (newWebhook) {
      this.setState({ loading: false })
    } else {
      this.getRequest((webhook) => {
        this.wasActive = webhook.active
        this.setState({
          webhook: Object.assign(this.state.webhook, webhook),
          loading: false
        })
      })
    }
  }

  handleChangeActive = (e) => {
    const { webhook } = this.state
    webhook.active = e.target.checked

    this.setState({
      webhook
    })
  };

  handleChangeFieldProperty = (property, e) => {
    const { webhook } = this.state
    const value = e.target.value.trim().replace(/ /, "")

    webhook[property] = value
    this.setState({
      webhook
    })
  };

  handleChangeEnableSSL = (e) => {
    const { webhook } = this.state
    webhook.enable_ssl_verification = e.target.checked
    this.setState({
      webhook
    })
  };

  inputClasses = (fieldName, required = false) => {
    const { webhook, formSubmitted } = this.state
    let type = ""

    if (fieldName === "url") type = "url"

    return classNames("input input_stretch input_blue", {
      input_error:
        (!validation(webhook[fieldName], type) ||
          (!webhook[fieldName] && required)) &&
        formSubmitted
    })
  };

  handleChangeEnv = (e) => {
    const { webhook } = this.state
    webhook.events_environment = e.target.value
    this.setState({
      webhook
    })
  };

  handleChangeActiveEvents = (field, e) => {
    var webhook = this.state.webhook
    webhook[field] = e.target.checked
    webhook.properties[field] = e.target.checked
    this.setState({
      webhook
    })
  };

  getRequest = (cb, getEventsFields = false) => {
    axios
      .get(
        `/apps/${this.props.match.params.appId}/app_hooks/${
          getEventsFields ? "new" : this.props.match.params.webhookId
        }`
      )
      .then((response) => {
        cb(response.data.data.results)
      })
  };

  createRequest = (cb) => {
    const { webhook } = this.state

    axios
      .post(`/apps/${this.props.match.params.appId}/app_hooks`, webhook)
      .then((response) => {
        cb(response.data.data.results)
      })
  };

  updateRequest = (cb) => {
    const { webhook } = this.state

    axios
      .put(
        `/apps/${this.props.match.params.appId}/app_hooks/${webhook.id}`,
        webhook
      )
      .then((response) => {
        cb(response.data.data.results)
      })
  };

  trackActive = (integration) => {
    if (window.analytics) {
      const { user, match } = this.props
      window.segmentHelper.identify(
        user.id,
        {
          integration_enabled: true
        },
        {
          integrations: {
            All: true,
            Webhooks: false
          }
        }
      )

      const params = {
        integration_name: `webhook - ${integration.name}`,
        webhook_id: integration.id
      }

      window.analytics.track("integration_enabled", params)
    }
  };

  handleSave = () => {
    const { id, name, url } = this.state.webhook

    this.setState({ formSubmitted: true })
    track("integration_created", {name, id, url});

    if (name && url && validation(url, "url")) {
      this.setState({ saving: true })

      if (id) {
        this.updateRequest((integration) => {
          NotificationManager.success("Webhook successfully saved", "OK", 5000)
          this.setState({ saving: false })

          if (integration.active && this.wasActive !== integration.active) { this.trackActive(integration) }

          this.wasActive = integration.active
        })
      } else {
        this.createRequest((integration) => {
          const { webhook } = this.state
          webhook.id = integration.id
          this.setState({ webhook })
          history.push(
            `/apps/${this.props.match.params.appId}/integrations/webhooks/${webhook.id}`
          )
          NotificationManager.success(
            "Webhook successfully created",
            "OK",
            5000
          )
          this.setState({ saving: false })

          if (integration.active) this.trackActive(integration)
        })
      }
    }
  };

  getUnique(arr, comp) {
    const unique = arr
      .map((e) => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e])

    return unique
  }

  getGroupsByCategory = (category) => {
    const { eventsFields, webhook } = this.state
    const groups = []

    for (const field of eventsFields.filter((f) => f.category === category)) {
      if (field.group) {
        groups.push({
          name: field.group,
          count: eventsFields.filter(
            (f) => f.group === field.group && webhook[f.name + "_events"]
          ).length
        })
      }
    }

    return this.getUnique(groups, "name")
  };

  handleChangeGroupTab = (currentGroup) => {
    this.setState({ currentGroup })
  };

  groupTabClasses = (groupName) => {
    const { currentGroup } = this.state

    return classNames(
      "container-header-menu__item container-header-menu__item_120 cp",
      {
        "container-header-menu__item_active": groupName === currentGroup
      }
    )
  };

  getFieldsByGroup = (category) => {
    const { eventsFields, currentGroup } = this.state

    return eventsFields.filter(
      (field) =>
        field.category === category &&
        (field.group ? field.group === currentGroup : true)
    )
  };

  render() {
    const { loading, webhook, saving } = this.state

    return (
      <div className="container-content__wrapper">
        <div className="container-content container-content__blue container-content__appsettings">
          {loading && (
            <div className="container-content__integrations_custom-container">
              <div className="animated-background timeline-item" />
              <div className="animated-background timeline-item__row" />
              <div className="animated-background timeline-item__row" />
              <div className="animated-background timeline-item__row" />
              <p>&nbsp;</p>
            </div>
          )}
          {!loading && (
            <div>
              <div className="container-content__integrations_custom-container-2">
                <NavLink
                  to={`/apps/${this.props.match.params.appId}/integrations/webhooks`}
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
                <span className="newapp-header__title">Custom webhook</span>
                <div className="fr">
                  <div className="container-content__integrations-switcher">
                    <label className="switcher switcher_green">
                      <input
                        id="viewSandbox"
                        onChange={this.handleChangeActive}
                        checked={webhook.active}
                        type="checkbox"
                        className="ios-switch green"
                      />
                      <div>
                        <div></div>
                      </div>
                    </label>
                    <label
                      htmlFor="viewSandbox"
                      className={
                        "switcher-title users-sandbox__switcher-label " +
                        (webhook.active ? " switcher-title_active-green" : "")
                      }
                    >
                      Enable integration
                    </label>
                  </div>
                  <button
                    className="button button_green button_160"
                    onClick={this.handleSave}
                    disabled={saving}
                  >
                    <span>{webhook.id ? "Save" : "Create"}</span>
                  </button>
                </div>
                <div className="container-content__integrations-settings__content">
                  <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_withtip">
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7.5V6.5C12 4.294 10.206 2.5 8 2.5C5.794 2.5 4 4.294 4 6.5V7.5H3V14.5H13V7.5H12ZM8 12.5C7.172 12.5 6.5 11.828 6.5 11C6.5 10.172 7.172 9.5 8 9.5C8.828 9.5 9.5 10.172 9.5 11C9.5 11.828 8.828 12.5 8 12.5ZM10 7.5H6V6.5C6 5.398 6.897 4.5 8 4.5C9.103 4.5 10 5.398 10 6.5V7.5Z"
                        fill="#97ADC6"
                      />
                    </svg>
                    <span>Authentication</span>
                  </div>
                  <div className="input-wrapper ta-left">
                    <label className="l-p__label" htmlFor="name">
                      Name
                    </label>
                    <div>
                      <div className="input-wrapper__required">
                        <input
                          value={webhook.name}
                          onChange={this.handleChangeFieldProperty.bind(
                            null,
                            "name"
                          )}
                          id="name"
                          placeholder="Webhook name"
                          type="text"
                          name="name"
                          required=""
                          className={this.inputClasses("name", true)}
                        />
                        <span className="required-label">Required</span>
                      </div>
                    </div>
                  </div>
                  <div className="input-wrapper ta-left">
                    <label className="l-p__label" htmlFor="url">
                      Webhook URL
                    </label>
                    <div>
                      <div className="input-wrapper__required">
                        <input
                          value={webhook.url}
                          onChange={this.handleChangeFieldProperty.bind(
                            null,
                            "url"
                          )}
                          id="url"
                          placeholder="URL"
                          type="text"
                          name="name"
                          required=""
                          className={this.inputClasses("url", true)}
                        />
                        <span className="required-label">Required</span>
                      </div>
                    </div>
                    <div className="input-wrapper__bottom-text input-wrapper__bottom-text_nowrap">
                      Send events to this URL using POST-request.{" "}
                      <a
                        className="link"
                        href="https://docs.apphud.com/integrations/webhook"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                  <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_withtip">
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.5325 2.09863C8.5505 2.1233 10.3732 4.49997 12.6665 4.49997C13.0352 4.49997 13.3332 4.79863 13.3332 5.16663V9.8333C13.3332 10.568 12.9505 11.292 12.4025 11.96L4.67783 4.23463C6.29917 3.61663 7.45317 2.11797 7.46717 2.09863C7.71917 1.7653 8.2805 1.7653 8.5325 2.09863ZM2.6665 5.16669C2.6665 4.88002 2.84917 4.64069 3.10317 4.54602L11.4765 12.9194C10.1685 14.0874 8.60117 14.9374 8.3105 15.09C8.21317 15.1414 8.1065 15.1667 7.99984 15.1667C7.89317 15.1667 7.7865 15.1414 7.68917 15.09C7.17584 14.8194 2.6665 12.372 2.6665 9.83335V5.16669Z"
                        fill="#97ADC6"
                      />
                    </svg>
                    <span>Security configuration</span>
                  </div>
                  <div className="input-wrapper ta-left">
                    <label className="l-p__label" htmlFor="token">
                      Secret token
                    </label>
                    <div>
                      <div className="input-wrapper__required">
                        <input
                          value={webhook.token}
                          onChange={this.handleChangeFieldProperty.bind(
                            null,
                            "token"
                          )}
                          id="token"
                          placeholder="Secret token"
                          type="text"
                          name="token"
                          required=""
                          className={this.inputClasses("token")}
                        />
                      </div>
                    </div>
                    <div className="input-wrapper__bottom-text input-wrapper__bottom-text_nowrap">
                      Use this token to validate received payloads.{" "}
                      <a
                        className="link"
                        href="https://docs.apphud.com/integrations/webhook"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                  <div className="input-wrapper ta-left">
                    <div className="container-content__integrations-settings__content-inputs__checkbox ta-left">
                      <input
                        id="SSL"
                        onChange={this.handleChangeEnableSSL}
                        checked={webhook.enable_ssl_verification}
                        type="checkbox"
                        className="checkbox"
                      />
                      <label
                        htmlFor="SSL"
                        title="Enable SSL verification"
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
                        <span className="label-text">
                          Enable SSL verification
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_withtip">
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9513 8.49936L9.81467 4.22603L7.93267 9.8727L4.65467 1.34937L1.97333 8.49936H0V10.4994H3.36L4.67867 6.98337L8.06733 15.7927L10.1853 9.43937L10.7153 10.4994H16V8.49936H11.9513Z"
                        fill="#97ADC6"
                      />
                    </svg>
                    <span>Environment configuration</span>
                  </div>
                  <div className="input-wrapper ta-left">
                    <InputRadio
                      checked={webhook.events_environment === "production"}
                      label="Send Production events only"
                      onChange={this.handleChangeEnv}
                      value="production"
                      useTip={false}
                    />
                    <InputRadio
                      checked={webhook.events_environment === "sandbox"}
                      label="Send Sandbox events only"
                      onChange={this.handleChangeEnv}
                      value="sandbox"
                      useTip={false}
                    />
                  </div>
                </div>
              </div>
              <div className="container-content__integrations_custom-container-2">
                <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_withtip">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.002 9.5V7.5H12.9C12.77 6.862 12.515 6.271 12.167 5.746L12.951 4.962L11.537 3.548L10.752 4.332C10.228 3.986 9.637 3.731 9.001 3.602V2.5H7.001V3.602C6.364 3.731 5.772 3.986 5.248 4.333L4.465 3.55L3.051 4.964L3.834 5.747C3.486 6.271 3.232 6.863 3.102 7.5H2V9.5H3.102C3.232 10.138 3.486 10.729 3.835 11.254L3.051 12.038L4.466 13.451L5.249 12.667C5.774 13.015 6.365 13.27 7.002 13.399V14.501H9.002V13.398C9.639 13.269 10.231 13.013 10.755 12.666L11.539 13.449L12.952 12.035L12.168 11.252C12.515 10.728 12.77 10.137 12.9 9.5H14.002ZM8 10.5C6.895 10.5 6 9.604 6 8.5C6 7.396 6.895 6.5 8 6.5C9.104 6.5 10 7.396 10 8.5C10 9.604 9.104 10.5 8 10.5Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span>Events configuration</span>
                  <Tip
                    description="Read more about events structure in Documentation."
                    buttonUrl="https://docs.apphud.com/integrations/events"
                  />
                </div>
              </div>
              <div className="container-content__blue-header container-content__blue-header_menu container-content__blue-header_rules">
                {this.getGroupsByCategory("events_configuration").map(
                  (group, index) => (
                    <div
                      onClick={this.handleChangeGroupTab.bind(null, group.name)}
                      className={this.groupTabClasses(group.name)}
                      key={index}
                    >
                      {group.name} ({group.count})
                    </div>
                  )
                )}
              </div>
              <div className="container-content__integrations_custom-container-2">
                <div className="container-content__integrations-settings__content">
                  <div className="container-content__integrations-settings__content-inputs">
                    {this.getFieldsByGroup("events_configuration").map(
                      (field, index) => (
                        <div className="input-wrapper ta-left" key={index}>
                          <label className="switcher switcher_nomargin switcher_events">
                            <input
                              id={field.name + "_events"}
                              onChange={this.handleChangeActiveEvents.bind(
                                this,
                                field.name + "_events"
                              )}
                              checked={webhook[field.name + "_events"]}
                              type="checkbox"
                              className="ios-switch green"
                            />
                            <div>
                              <div></div>
                            </div>
                          </label>
                          <div className="inline-wrapper va-top">
                            <label
                              htmlFor={field.name + "_events"}
                              className="l-p__label"
                            >
                              {titleize(field.name).replace(/_/g, " ")}
                            </label>
                            <div
                              className="input-wrapper__bottom-text"
                              dangerouslySetInnerHTML={{ __html: field.hint }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(WebhooksShow)
