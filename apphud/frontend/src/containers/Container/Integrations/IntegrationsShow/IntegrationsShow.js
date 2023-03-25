import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../../history"
import Aux from "../../../../hoc/Aux"
import { NotificationManager } from "../../../../libs/Notifications"
import { fetchIntegrationsRequest } from "../../../../actions/integrations"
import axios from "axios"
import filter from "lodash/filter"
import titleize from "titleize"
import Modal from "react-modal"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Tip from "../../../Common/Tip"
import InputSelect from "../../../Common/InputSelect"
import AliasPicker from "./AliasPicker"
import {track} from "../../../../libs/helpers";

const INTEGRATIONS_WITH_REQUIRED_EVENTS = ["adjust-ios", "adjust-android"]

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
    width: 410
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

const setDefaults = ({ fields, properties }) => {
  for (const field of fields) {
    if (field.type === "select") {
      if (!properties[field.name] && field.collection[0]) { properties[field.name] = field.collection[0] }

      if (!properties[field.name + "_alias"]) { properties[field.name + "_alias"] = field.default_alias_name }
    }
  }
}

class IntegrationsShow extends Component {
  state = {
    integration: {
      fields: []
    },
    fieldsCategories: [],
    loading: false,
    formSubmitted: false,
    appStoreIdPopup: false,
    currentGroup: "Regular",
    integrationsWarningClosed: true
  };

  componentWillMount() {
    this.setState({ loading: true })
    this.props.fetchIntegrationsRequest(
      { appId: this.props.match.params.appId, platform: this.props.match.params.platform },
      (integrations) => {
        var integration = integrations.find(
          (integrationItem) =>
            integrationItem.id === this.props.match.params.integrationId
        )
        var fieldsCategories = integration.fields.map((field) => ({
          name: field.category,
          icon: field.category_icon,
          tip_description: field.category_tip_description,
          tip_url: field.category_tip_url
        }))
        fieldsCategories = this.getUnique(fieldsCategories, "name")
        const fieldWithGroup = integration.fields.find(
          (f) => f.group && f.group.length > 0
        )

        setDefaults(integration)

        this.setState({
          integration,
          fieldsCategories,
          loading: false,
          currentGroup: fieldWithGroup ? fieldWithGroup.group : "Regular",
          integrationsWarningClosed: JSON.parse(
            localStorage.getItem(`integrationsWarning1_${integration.id}`)
          )
        })

        if (
          !integration.available_on_free_plan &&
          this.props.user.subscription.plan.free
        ) { history.push("/profile/billing/change-plan") }

        document.title = "Apphud | " + integration.title + " integration"
        this.integrationActive = integration.active
      }
    )
  }

  componentDidMount() {
    document.title = "Apphud | Integrations"
  }

  handleChangeFieldProperty = (property, e, trim = true) => {
    const { integration } = this.state
    let value = e.target.value

    if (trim) value = e.target.value.trim().replace(/ /, "")

    integration.properties[property] = value
    this.setState({
      integration
    })
  };

  trackActive = () => {
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
      window.analytics.track("integration_enabled", {
        integration_name: match.params.integrationId
      })
    }
  };

  updateIntegrationProps = (integration, cb) => {
    integration = Object.assign({}, integration, integration.properties)
    axios
      .put(
        `/apps/${this.props.match.params.appId}/integrations/${integration.id}`,
        integration
      )
      .then((response) => {
        cb(response.data.data.results)
      })
  };

  getInvalidGroups = () => {
    const invalidGroups = []

    if (this.state.formSubmitted) {
      filter(this.state.integration.fields, { type: "text" }).forEach(
        (field) => {
          if (
            (this.fieldRequired(field) &&
              !this.state.integration.properties[field.name]) ||
            !this.validation(
              this.state.integration.properties[field.name],
              field.regex
            )
          ) {
            invalidGroups.push(field.group)
          }
        }
      )
    }

    return invalidGroups
  };

  handleSave = () => {
    this.setState({ formSubmitted: true })
    let valid = true
    const { integration } = this.state
    track("integration_created", integration);
    filter(integration.fields, { type: "text" }).forEach((field) => {
      if (
        (this.fieldRequired(field) && !integration.properties[field.name]) ||
        !this.validation(integration.properties[field.name], field.regex)
      ) {
        valid = false
      }
    })

    if (!valid) return

    if (
      integration.id === "appsflyer-ios" &&
      integration.active &&
      !this.props.application.appstore_app_id
    ) { this.handleShowAppStoreIdPopup() } else {
      this.updateIntegrationProps(integration, (newIntegration) => {
        if (
          newIntegration.active &&
          this.integrationActive !== newIntegration.active
        ) { this.trackActive() }

        NotificationManager.success(
          "Integration successfully saved",
          "OK",
          5000
        )
        this.setState({
          formSubmitted: false,
          integration: newIntegration
        })
        this.integrationActive = newIntegration.active
      })
    }
  };

  handleCloseAppStoreIdPopup = () => {
    this.setState({ appStoreIdPopup: false })
  };

  handleShowAppStoreIdPopup = () => {
    this.setState({ appStoreIdPopup: true })
  };

  handleChangeActiveEvents = (fieldName, e) => {
    var integration = this.state.integration
    integration[fieldName] = e.target.checked
    integration.properties[fieldName] = e.target.checked

    this.setState({
      integration
    })
  };

  handleChangeActiveIntegration = (e) => {
    var integration = this.state.integration
    integration.active = e.target.checked
    this.setState({
      integration
    })
  };

  handleChangeGroupTab = (currentGroup) => {
    this.setState({ currentGroup })
  };

  getUnique(arr, comp) {
    const unique = arr
      .map((e) => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e])

    return unique
  }

  getFieldsByCategoryAndGroup = (category) => {
    const { integration, currentGroup } = this.state

    return integration.fields.filter(
      (field) =>
        field.category === category &&
        (field.group ? field.group === currentGroup : true)
    )
  };

  getGroupsByCategory = (category) => {
    const { integration } = this.state
    const groups = []

    for (const field of integration.fields.filter(
      (f) => f.category === category
    )) {
      if (field.group) {
        groups.push({
          name: field.group,
          count: integration.fields.filter(
            (f) => f.group === field.group && integration[f.name + "_events"]
          ).length
        })
      }
    }

    return this.getUnique(groups, "name")
  };

  validation = (value, regex) => {
    if (value && regex) {
      regex = regex.replace("/", "//")
      return new RegExp(regex).test(value)
    } else return true
  };

  fieldClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error:
        (!this.validation(
          this.state.integration.properties[field.name],
          field.regex
        ) ||
          (!this.state.integration.properties[field.name] &&
            this.fieldRequired(field))) &&
        this.state.formSubmitted,
      input_copy: field.read_only
    })
  };

  fieldSelectClasses = (field) => {
    return classNames("input-select input-select_blue", {
      input_error:
        !this.state.integration.properties[field.name] &&
        this.fieldRequired(field) &&
        this.state.formSubmitted
    })
  };

  onCopyUrl = (fieldId) => {
    this.setState({ [`${fieldId}_copy`]: true })
    setTimeout(() => {
      this.setState({ [`${fieldId}_copy`]: false })
    }, 1000)
  };

  inputWrapperClasses = (field) => {
    return classNames("", {
      "input-wrapper__switch": field.switch,
      "input-wrapper__required": this.fieldRequired(field)
    })
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

  fieldRequired = (field) => {
    const { integration } = this.state

    return (
      field.required ||
      (INTEGRATIONS_WITH_REQUIRED_EVENTS.indexOf(integration.id) > -1 &&
        integration[`${field.name}_events`])
    )
  };

  closeWarning = () => {
    localStorage.setItem(
      `integrationsWarning1_${this.state.integration.id}`,
      true
    )
    this.setState({ integrationsWarningClosed: true })
  };

  render() {
    const { integration, loading, integrationsWarningClosed } = this.state
;
    const { platform } = this.props.match.params;
    return (
      <div className="container-content__wrapper">
        <div className="container-content container-content__blue container-content__appsettings">
      <Modal
        isOpen={this.state.appStoreIdPopup}
        onRequestClose={this.handleCloseAppStoreIdPopup}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Enter App Store app ID"
      >
        <div style={{ padding: "20px 30px" }}>
          <div className="newapp-header__title">Enter App Store app ID</div>
          <div className="input-wrapper">
            Please, enter your app’s App Store ID to enable this integration
          </div>
          <div className="input-wrapper">
            <button
              className="button button_blue popup-button fl"
              onClick={this.handleCloseAppStoreIdPopup}
            >
              <span>Cancel</span>
            </button>
            <NavLink
              to={`/apps/${this.props.match.params.appId}/settings/general`}
              className="button button_green popup-button fr"
            >
              <span>Open App Settings</span>
            </NavLink>
          </div>
        </div>
      </Modal>
      {loading && (
        <div className="container-content__integrations_custom-container-2">
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
              to={`/apps/${this.props.match.params.appId}/integrations/${this.state.integration.platform}`}
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
              Configure {integration.title} integration ({platform === 'ios' ? 'iOS' : 'Android'})
            </span>
            <div className="fr">
              <div className="container-content__integrations-switcher">
                <label className="switcher switcher_green">
                  <input
                    id="viewSandbox"
                    onChange={this.handleChangeActiveIntegration}
                    checked={integration.active}
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
                    (integration.active ? " switcher-title_active-green" : "")
                  }
                >
                  Enable integration
                </label>
              </div>
              <button
                className="button button_green button_160"
                onClick={this.handleSave}
              >
                <span>Save</span>
              </button>
            </div>
          </div>
          <div className="container-content__integrations_custom-container-2">
            {["branch-ios", "branch-android", "appsflyer-ios", "appsflyer-android", "adjust-ios", "adjust-android"].indexOf(integration.id) > -1 &&
            !integrationsWarningClosed && (
              <div className="dashboard-checklist mt30">
                <div className="dashboard-checklist__title">Important</div>
                <div className="dashboard-checklist__content">
                  In order to receive attribution data from Facebook, you
                  should accept Facebook’s "Advanced Mobile Measurement
                  Agreement" using{" "}
                  <a
                    href="https://www.facebook.com/ads/manage/advanced_mobile_measurement/app_based_tos/"
                    className="link"
                    target="_blank"
                  >
                    this link
                  </a>
                  .
                </div>
                <svg
                  className="dashboard-checklist__content-close cp"
                  onClick={this.closeWarning}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
                      fill="#FCD6A7"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <path d="M0 0H24V24H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )}
            {["facebook-ios", "facebook-android"].indexOf(integration.id) > -1 && (
              <div className="dashboard-checklist mt30">
                <div className="dashboard-checklist__title">
                  Integration requirements
                </div>
                <ul className="dashboard-checklist__content">
                  <li className="dashboard-checklist__content-item">
                    <span className="va-top">
                      ● &nbsp;IOS only: Requesting IDFA consent is highly recommended for events to show up correctly in Ads Manager. Without IDFA events may not appear.
                    </span>
                  </li>
                  <li className="dashboard-checklist__content-item">
                    <span className="va-top">
                      ● &nbsp;Disable Facebook Automatic Purchase Events
                      Logging.
                    </span>
                  </li>
                  <li className="dashboard-checklist__content-item">
                    <span className="va-top">
                      ● &nbsp;Read{" "}
                      <a
                        className="link"
                        href="https://docs.apphud.com/integrations/attribution/facebook"
                        target="_blank"
                      >
                        documentation
                      </a>{" "}
                      for details.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {this.state.fieldsCategories.map((category, index) => (
            <div key={index}>
              <div className="container-content__integrations_custom-container-2">
                <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_withtip">
                  {category.icon === "gear" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.002 9V7H12.9C12.77 6.362 12.515 5.771 12.167 5.246L12.951 4.462L11.537 3.048L10.752 3.832C10.228 3.486 9.637 3.231 9.001 3.102V2H7.001V3.102C6.364 3.231 5.772 3.486 5.248 3.833L4.465 3.05L3.051 4.464L3.834 5.247C3.486 5.771 3.232 6.363 3.102 7H2V9H3.102C3.232 9.638 3.486 10.229 3.835 10.754L3.051 11.538L4.466 12.951L5.249 12.167C5.774 12.515 6.365 12.77 7.002 12.899V14.001H9.002V12.898C9.639 12.769 10.231 12.513 10.755 12.166L11.539 12.949L12.952 11.535L12.168 10.752C12.515 10.228 12.77 9.637 12.9 9H14.002ZM8 10C6.895 10 6 9.104 6 8C6 6.896 6.895 6 8 6C9.104 6 10 6.896 10 8C10 9.104 9.104 10 8 10Z"
                        fill="#97ADC6"
                      />
                    </svg>
                  )}
                  {category.icon === "lock" && (
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
                  )}
                  {category.icon === "dollar" && (
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
                        d="M8 15.5C11.866 15.5 15 12.366 15 8.5C15 4.63401 11.866 1.5 8 1.5C4.13401 1.5 1 4.63401 1 8.5C1 12.366 4.13401 15.5 8 15.5ZM9.5 6H8.5V5.5H7.5V6C7.10218 6 6.72064 6.15804 6.43934 6.43934C6.15804 6.72064 6 7.10218 6 7.5C6 7.89782 6.15804 8.27936 6.43934 8.56066C6.72064 8.84196 7.10218 9 7.5 9H8.5C8.77614 9 9 9.22386 9 9.5C9 9.77614 8.77614 10 8.5 10H7.5H6.5V11H7.5V11.5H8.5V11C8.89782 11 9.27936 10.842 9.56066 10.5607C9.84196 10.2794 10 9.89783 10 9.5C10 9.10218 9.84196 8.72064 9.56066 8.43934C9.27936 8.15804 8.89782 8 8.5 8H7.5C7.22386 8 7 7.77614 7 7.5C7 7.22386 7.22386 7 7.5 7H8.5H9.5V6Z"
                        fill="#97ADC6"
                      />
                    </svg>
                  )}
                  <span>{titleize(category.name).replace(/_/g, " ")}</span>
                  {category.tip_description && (
                    <Tip
                      description={category.tip_description}
                      buttonUrl={category.tip_url}
                    />
                  )}
                </div>
              </div>
              {this.getGroupsByCategory(category.name).length > 0 && (
                <div
                  ref="scrollContainer"
                  className="container-content__blue-header container-content__blue-header_menu container-content__blue-header_rules"
                >
                  <div className="container-header-menu container-header-menu_rules">
                    {this.getGroupsByCategory(category.name).map(
                      (group, index) => (
                        <div
                          onClick={this.handleChangeGroupTab.bind(
                            null,
                            group.name
                          )}
                          className={this.groupTabClasses(group.name)}
                          key={index}
                        >
                          {group.name} ({group.count})
                          {this.getInvalidGroups().indexOf(group.name) >
                          -1 && (
                            <svg
                              className="fr"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.70708 8.7071C1.31655 8.31658 1.31655 7.68341 1.70708 7.29289L7.36393 1.63603C7.75446 1.24551 8.38762 1.24551 8.77815 1.63603L14.435 7.29289C14.8255 7.68341 14.8255 8.31658 14.435 8.7071L8.77815 14.364C8.38762 14.7545 7.75446 14.7545 7.36393 14.364L1.70708 8.7071ZM7.24997 5H8.74997V9H7.24997V5ZM7.99997 11.5C8.55225 11.5 8.99997 11.0523 8.99997 10.5C8.99997 9.94771 8.55225 9.5 7.99997 9.5C7.44768 9.5 6.99997 9.94771 6.99997 10.5C6.99997 11.0523 7.44768 11.5 7.99997 11.5Z"
                                fill="#FF0C46"
                              />
                            </svg>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              <div className="container-content__integrations_custom-container-2">
                <div className="container-content__integrations-settings__content">
                  <div className="container-content__integrations-settings__content-inputs">
                    {this.getFieldsByCategoryAndGroup(category.name).map(
                      (field, index) =>
                        field.type === "text" ? (
                          <div
                            className={
                              "input-wrapper ta-left " +
                              (field.switch && " input-wrapper_with-switcher")
                            }
                            key={index}
                          >
                            <label
                              className="l-p__label"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <div>
                              <div
                                className={this.inputWrapperClasses(field)}
                              >
                                <input
                                  value={
                                    field.read_only &&
                                    integration.id !== "telegram-ios" && integration.id !== "telegram-android"
                                      ? (field.placeholder)
                                      : integration.properties[field.name] ||
                                      ""
                                  }
                                  onChange={(e) =>
                                    this.handleChangeFieldProperty(
                                      field.name,
                                      e
                                    )
                                  }
                                  id={field.name}
                                  placeholder={field.placeholder}
                                  type="text"
                                  name="name"
                                  required=""
                                  onFocus={(e) =>
                                    field.read_only ? e.target.select() : ""
                                  }
                                  readOnly={field.read_only}
                                  className={this.fieldClasses(field)}
                                />
                                {this.fieldRequired(field) && (
                                  <span className="required-label">
                                    Required
                                  </span>
                                )}
                                {field.read_only && !field.copy_disabled && (
                                  <CopyToClipboard
                                    text={field.placeholder}
                                    onCopy={this.onCopyUrl.bind(
                                      null,
                                      field.id
                                    )}
                                  >
                                    <span className="input_copy-text input_copy-text_custom">
                                      {!this.state[`${field.id}_copy`] &&
                                      "Copy"}
                                      {this.state[`${field.id}_copy`] &&
                                      "Copied"}
                                    </span>
                                  </CopyToClipboard>
                                )}
                              </div>
                              {field.switch && (
                                <label className="switcher">
                                  <input
                                    onChange={this.handleChangeActiveEvents.bind(
                                      this,
                                      field.name + "_events"
                                    )}
                                    checked={
                                      integration[field.name + "_events"]
                                    }
                                    type="checkbox"
                                    className="ios-switch green"
                                  />
                                  <div>
                                    <div></div>
                                  </div>
                                </label>
                              )}
                            </div>
                            <div
                              className="input-wrapper__bottom-text input-wrapper__bottom-text_nowrap"
                              dangerouslySetInnerHTML={{ __html: field.hint }}
                            />
                          </div>
                        ) : field.type === "select" ? (
                          <div
                            className={
                              "input-wrapper ta-left " +
                              (field.switch && " input-wrapper_with-switcher")
                            }
                            key={index}
                          >
                            <label
                              className="l-p__label"
                              htmlFor={field.name}
                            >
                              {field.label}
                            </label>
                            <div>
                              <div
                                className={this.inputWrapperClasses(field)}
                              >
                                <InputSelect
                                  name={field.name}
                                  placeholder={field.placeholder}
                                  value={
                                    integration.properties[field.name]
                                      ? {
                                        label:
                                          integration.properties[
                                            field.name
                                            ],
                                        value:
                                          integration.properties[
                                            field.name
                                            ]
                                      }
                                      : null
                                  }
                                  onChange={(item) => {
                                    this.handleChangeFieldProperty(
                                      field.name,
                                      { target: item },
                                      false
                                    )
                                  }}
                                  getOptionLabel={({ label }) => label}
                                  getOptionValue={({ value }) => value}
                                  isSearchable={false}
                                  autoFocus={false}
                                  clearable={false}
                                  isDisabled={field.read_only}
                                  classNamePrefix="input-select"
                                  className={this.fieldSelectClasses(field)}
                                  options={field.collection.map((item) => ({
                                    label: item,
                                    value: item
                                  }))}
                                />
                                {this.fieldRequired(field) && (
                                  <span className="required-label">
                                    Required
                                  </span>
                                )}
                              </div>
                              {!field.read_only && field.switch && (
                                <label className="switcher">
                                  <input
                                    onChange={this.handleChangeActiveEvents.bind(
                                      this,
                                      field.name + "_events"
                                    )}
                                    checked={
                                      integration[field.name + "_events"]
                                    }
                                    type="checkbox"
                                    className="ios-switch green"
                                  />
                                  <div>
                                    <div></div>
                                  </div>
                                </label>
                              )}
                            </div>
                            <AliasPicker
                              value={
                                integration.properties[field.name + "_alias"]
                              }
                              onChange={(value) => {
                                this.handleChangeFieldProperty(
                                  field.name + "_alias",
                                  { target: { value } },
                                  false
                                )
                              }}
                            />
                            <div
                              className="input-wrapper__bottom-text input-wrapper__bottom-text_nowrap"
                              dangerouslySetInnerHTML={{ __html: field.hint }}
                            />
                          </div>
                        ) : field.type === "checkbox" && field.switch ? (
                          <div className="input-wrapper ta-left" key={index}>
                            <label className="switcher switcher_nomargin switcher_events">
                              <input
                                id={field.name + "_events"}
                                onChange={this.handleChangeActiveEvents.bind(
                                  this,
                                  field.name + "_events"
                                )}
                                checked={integration[field.name + "_events"]}
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
                                dangerouslySetInnerHTML={{
                                  __html: field.hint
                                }}
                              />
                            </div>
                          </div>
                        ) : field.type === "checkbox" && !field.switch ? (
                          <div
                            className="container-content__integrations-settings__content-inputs__checkbox ta-left"
                            key={index}
                          >
                            <input
                              id={field.name}
                              onChange={this.handleChangeActiveEvents.bind(
                                this,
                                field.name
                              )}
                              checked={integration.properties[field.name]}
                              type="checkbox"
                              className="checkbox"
                            />
                            <label
                              htmlFor={field.name}
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
                              <span
                                className="label-text"
                                dangerouslySetInnerHTML={{
                                  __html: field.hint
                                }}
                              />
                            </label>
                            {field.tip_description && (
                              <Tip
                                description={field.tip_description}
                                buttonUrl={field.tip_url}
                              />
                            )}
                          </div>
                        ) : field.type === "button" ? (
                          <div className="input-wrapper ta-left" key={index}>
                            <a
                              href={field.url}
                              className={`button button_blue button_block c-c__i-s__c-button_${field.size}`}
                              target="_blank"
                            >
                              {field.value}
                            </a>
                            <div
                              className="input-wrapper__bottom-text input-wrapper__bottom-text_nowrap"
                              dangerouslySetInnerHTML={{ __html: field.hint }}
                            />
                          </div>
                        ) : (
                          <div />
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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

const mapDispatchToProps = {
  fetchIntegrationsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationsShow)
