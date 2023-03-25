import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import Aux from "../../../../../hoc/Aux"
import axios from "axios"
import SweetAlert from "react-swal"
import LanguageInputSelect from "../../../../Common/LanguageInputSelect"
import Modal from "react-modal"
import { NotificationManager } from "../../../../../libs/Notifications"

import {
  updateApplicationRequest,
  fetchApplicationRequest
} from "../../../../../actions/application"
import {track} from "../../../../../libs/helpers";

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

class IOSLocalization extends Component {
  state = {
    languages: [],
    default_locale: "",
    removeAlertOpen: false,
    defaultLocalePopup: false,
    loading: false,
    loadingLangs: false
  };

  componentDidMount() {
    const { appId } = this.props.match.params
    document.title = "Apphud | Localization"
    this.getLanguages()
    this.setState({ loading: true })
    this.setState({
      default_locale: this.props.application.default_locale,
      loading: false
    })
  }

  getLanguages = () => {
    const { application } = this.props
    this.setState({ loadingLangs: true })
    axios.get("/languages").then(({ data }) => {
      const languages = []
      const allLanguages = JSON.parse(JSON.stringify(data.data.results))

      for (const locale of application.locales) {
        const language = data.data.results.find((item) => item.code === locale)

        if (language) {
          if (language.code === application.default_locale) { language.default = true }

          languages.push(language)
        }
      }

      this.setState({ languages, allLanguages, loadingLangs: false })
    })
  };

  removeLanguage = (index) => {
    this.removeIndex = index
    this.setState({ removeAlertOpen: true })
  };

  handleCallbackRemoveAlert = (remove) => {
    this.setState({ removeAlertOpen: false })

    if (remove) {
      this.setState((state) => {
        const languages = state.languages
        languages.splice(this.removeIndex, 1)
        return { languages }
      })
    }
  };

  handleCloseDefaultPopup = () => {
    this.setState({ defaultLocalePopup: false })
  };

  handleOpenDefaultPopup = (index) => {
    this.defaultIndex = index
    this.setState({ defaultLocalePopup: true })
  };

  handleMakeDefault = () => {
    this.setState((state) => {
      const languages = state.languages
      return { default_locale: languages[this.defaultIndex].code }
    }, this.handleCloseDefaultPopup)
  };

  handleAddLocalization = (item) => {
    this.setState((state) => {
      const languages = state.languages
      languages.push(item)
      return { languages }
    })
  };

  handleSave = () => {
    const { default_locale, languages } = this.state
    const { appId } = this.props.match.params
    const params = {
      id: appId,
      locales: languages.map(({ code }) => code),
      default_locale
    }

    this.setState({ saving: true })
    this.props.updateApplicationRequest(params, (app) => {
      this.props.fetchApplicationRequest(appId, (application) => { });
      track("ios_lang_settings_saved", params);
      NotificationManager.success(
        "Localization successfully saved",
        "OK",
        5000
      )
      this.setState({ saving: false })
    })
  };

  filterAllLanguages = (allLanguages) => {
    const { languages } = this.state

    for (const language of languages) {
      allLanguages = allLanguages.filter((l) => l.code !== language.code)
    }

    return allLanguages
  };

  render() {
    const {
      languages,
      allLanguages,
      default_locale,
      removeAlertOpen,
      defaultLocalePopup,
      loading,
      loadingLangs,
      saving
    } = this.state;

    return (
      <>
        <div className="container-content__blue-header pr15">
          <div className="container-title">
            <span className="va-middle text-black">iOS localization</span>
          </div>
          <button
            disabled={saving}
            onClick={this.handleSave}
            className="button button_green l-p__button fr mt0"
          >
            <span>Save</span>
          </button>
        </div>
        <div className="container-content__blue-content">
          <div className="container-content__notification">
            Localize Push notifications, offer screens and surveys in to different languages.
          </div>
          <SweetAlert
            isOpen={removeAlertOpen}
            type="warning"
            title={"Remove localization?"}
            text="All localizations for rules and screens will be removed. This can not be undone."
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            callback={this.handleCallbackRemoveAlert}
          />
          <Modal
            isOpen={defaultLocalePopup}
            onRequestClose={this.handleCloseDefaultPopup}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Enter App Store app ID"
          >
            <div style={{ padding: "20px 30px" }}>
              <div className="newapp-header__title">
                Change default localization?
              </div>
              <div className="input-wrapper">
                Default localization will be applied for every user with missing
                localization.
              </div>
              <div className="input-wrapper">
                <button
                  className="button button_blue popup-button fl"
                  onClick={this.handleCloseDefaultPopup}
                >
                  <span>Cancel</span>
                </button>
                <button
                  onClick={this.handleMakeDefault}
                  className="button button_green popup-button fr"
                >
                  <span>Change</span>
                </button>
              </div>
            </div>
          </Modal>
          <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_uploader">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.58008 10.0467L6.88675 8.37333L6.90675 8.35333C8.06675 7.05999 8.89341 5.57333 9.38008 3.99999H11.3334V2.66666H6.66675V1.33333H5.33342V2.66666H0.666748V3.99333H8.11341C7.66675 5.27999 6.96008 6.49999 6.00008 7.56666C5.38008 6.87999 4.86675 6.12666 4.46008 5.33333H3.12675C3.61341 6.41999 4.28008 7.44666 5.11341 8.37333L1.72008 11.72L2.66675 12.6667L6.00008 9.33333L8.07341 11.4067L8.58008 10.0467ZM12.3334 6.66666H11.0001L8.00008 14.6667H9.33342L10.0801 12.6667H13.2467L14.0001 14.6667H15.3334L12.3334 6.66666ZM10.5867 11.3333L11.6667 8.44666L12.7467 11.3333H10.5867Z"
                fill="#97ADC6"
              />
            </svg>
            <span>Screens and rules localizations</span>
          </div>
          {loading || loadingLangs ? (
            <div
              className="animated-background timeline-item"
              style={{ height: 32, marginTop: 3, width: 255 }}
            />
          ) : (
              <div className="appsettings-localization">
                {languages.map((language, index) => (
                  <div className="appsettings-localization__item" key={index}>
                    <div className="appsettings-localization__item-language">
                      <img
                        className="language-select__icon"
                        src={language.icon}
                        alt="Language"
                      />
                      <span className="va-middle">{language.name}</span>
                    </div>
                    {language.code === default_locale ? (
                      <div className="appsettings-localization__item-label appsettings-localization__item-label_default">
                        Default
                      </div>
                    ) : (
                        <Aux>
                          <button
                            onClick={this.removeLanguage.bind(null, index)}
                            className="button button_red va-middle pushrules-content__row-column-3__button appsettings-localization__item-button"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M10 3V2H6V3H2V5H14V3H10Z" fill="white" />
                              <path
                                d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                                fill="white"
                              />
                            </svg>
                          </button>
                          <div
                            onClick={this.handleOpenDefaultPopup.bind(null, index)}
                            className="link link_normal appsettings-localization__item-label cp"
                          >
                            Make default
                      </div>
                        </Aux>
                      )}
                  </div>
                ))}
                <LanguageInputSelect
                  name="add_localization"
                  placeholder="Add localization"
                  value={""}
                  onChange={this.handleAddLocalization}
                  isSearchable={false}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ code }) => code}
                  autoFocus={false}
                  clearable={false}
                  classNamePrefix="input-select"
                  className="input-select input-select_blue appsettings-localization__select"
                  options={this.filterAllLanguages(allLanguages)}
                />
              </div>
            )}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application,
    user: state.sessions
  }
}

const mapDispatchToProps = {
  updateApplicationRequest,
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(IOSLocalization)
