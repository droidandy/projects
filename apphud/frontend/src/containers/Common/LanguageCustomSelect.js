import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import Aux from "../../hoc/Aux"
import history from "../../history"
import axios from "axios"
import { fetchApplicationRequest } from "../../actions/application"

const labelKey = "name"
const valueKey = "code"

class LanguageSelect extends Component {
  state = {
    open: false,
    languages: []
  };

  setPosition = () => {
    var rect = this.refs.customselect.getBoundingClientRect()
    var rectmenu = this.refs.menu.getBoundingClientRect()
    this.setState({
      left: rect.x - rectmenu.width / 2 + rect.width / 2,
      top: rect.y + rect.height
    })
  };

  getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        this.setPosition()
        document.body.style.paddingRight = this.getScrollbarWidth() + "px"
        document.body.style.overflow = "hidden"
        this.props.fetchApplicationRequest(this.props.appId, this.setLanguages)
      } else {
        document.body.style.paddingRight = "0px"
        document.body.style.overflow = ""
      }
    })
  };

  onIconError = (e) => {
    e.target.style.display = "none"
  };

  itemClasses = (option) => {
    return classNames("custom-select__outer-menu__item", {
      "custom-select__outer-menu__item_active":
        option[valueKey] === this.props.value,
      "custom-select__outer-menu__item__notcurrent":
        option[valueKey] !== this.props.value
    })
  };

  getCurrentLabel = () => {
    const find = this.state.languages.find((l) => l.code === this.props.value)

    if (find) return find.name
  };

  getCurrentIcon = () => {
    const find = this.state.languages.find((l) => l.code === this.props.value)

    if (find) return find.icon
  };

  handleClickManageLocalizations = (e) => {
    const { appId } = this.props

    e.preventDefault()
    this.toggleOpen()

    window.open(`/apps/${appId}/settings/ios-localization`)
  };

  setLanguages = () => {
    const languages = []
    const { application } = this.props

    for (const locale of application.locales) {
      const language = this.state.allLanguages.find(
        (item) => item.code === locale
      )

      if (language) {
        if (language.code === application.default_locale) { language.default = true }

        languages.push(language)
      }
    }

    this.setState({ languages })
  };

  getLanguages = () => {
    const { application } = this.props
    axios.get("/languages").then(({ data }) => {
      this.setState({ allLanguages: data.data.results }, this.setLanguages)
    })
  };

  componentWillMount() {
    this.getLanguages()
  }

  render() {
    const {
      value,
      onChange,
      invalidLanguages,
      disableInvalidIcon
    } = this.props
    const { open, left, top, languages } = this.state
    return (
      <div
        ref="customselect"
        className={"custom-select " + (open && "custom-select_open")}
      >
        <div
          className="custom-select__inner custom-select__inner_language"
          onClick={this.toggleOpen}
        >
          <img
            className="language-select__icon"
            src={this.getCurrentIcon()}
            alt="Language"
          />
          <div className="custom-select__value">{this.getCurrentLabel()}</div>
          <div className="custom-select__arrow">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.41 0.59L6 5.17L10.59 0.59L12 2L6 8L0 2L1.41 0.59Z"
                fill="#0085FF"
              />
            </svg>
          </div>
        </div>
        {!disableInvalidIcon && (
          <svg
            style={
              invalidLanguages && invalidLanguages.length > 0
                ? { visibility: "visible" }
                : {}
            }
            className="custom-select__invalid-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.10043 13.4141C1.31939 12.6331 1.31939 11.3668 2.10043 10.5857L10.5857 2.10043C11.3668 1.31939 12.6331 1.31939 13.4141 2.10043L21.8994 10.5857C22.6805 11.3668 22.6805 12.6331 21.8994 13.4141L13.4141 21.8994C12.6331 22.6805 11.3668 22.6805 10.5857 21.8994L2.10043 13.4141ZM10.9999 6.99993H12.9999V12.9999H10.9999V6.99993ZM11.9999 16.9999C12.8284 16.9999 13.4999 16.3283 13.4999 15.4999C13.4999 14.6715 12.8284 13.9999 11.9999 13.9999C11.1715 13.9999 10.4999 14.6715 10.4999 15.4999C10.4999 16.3283 11.1715 16.9999 11.9999 16.9999Z"
              fill="#FF0C46"
            />
          </svg>
        )}
        {open && (
          <Aux>
            <div className="custom-select__overlay" onClick={this.toggleOpen} />
            <div
              ref="menu"
              className="custom-select__outer custom-select__outer_language"
              style={{ left, top }}
            >
              <div className="custom-select__outer-menu custom-select__scrollable">
                <div
                  className="custom-select__outer-menu__item custom-select__outer-menu__item_link custom-select__outer-menu__item__notcurrent"
                  onClick={this.handleClickManageLocalizations}
                >
                  <span className="link link_normal cp">
                    Manage localizations
                  </span>
                  <svg
                    className="fr"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 2C0 0.895429 0.895433 0 2 0H5V2H2L2 10H10V7H12V10C12 11.1046 11.1046 12 10 12H2C0.895431 12 0 11.1046 0 10V2ZM12 0H7L8.79289 1.79289L6.2929 4.29289L7.70711 5.70711L10.2071 3.20711L12 5V0Z"
                      fill="#0085FF"
                    />
                  </svg>
                </div>
                {languages.map((option, index) => (
                  <div
                    className={this.itemClasses(option)}
                    key={index}
                    onClick={() => {
                      onChange(option)
                      this.toggleOpen()
                    }}
                  >
                    <img
                      className="language-select__icon"
                      src={option.icon}
                      alt="Language"
                    />
                    <span className="custom-select__outer-menu__item-label">
                      {option[labelKey]}
                    </span>
                    {invalidLanguages &&
                      invalidLanguages.indexOf(option[valueKey]) > -1 && (
                      <svg
                        className="custom-select__outer-menu__item-invalid__icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.7072 8.7071C1.31668 8.31658 1.31668 7.68341 1.7072 7.29289L7.36405 1.63603C7.75458 1.24551 8.38774 1.24551 8.77827 1.63603L14.4351 7.29289C14.8256 7.68341 14.8256 8.31658 14.4351 8.7071L8.77827 14.364C8.38774 14.7545 7.75458 14.7545 7.36405 14.364L1.7072 8.7071ZM7.25009 5H8.75009V9H7.25009V5ZM8.00009 11.5C8.55238 11.5 9.00009 11.0523 9.00009 10.5C9.00009 9.94771 8.55238 9.5 8.00009 9.5C7.44781 9.5 7.00009 9.94771 7.00009 10.5C7.00009 11.0523 7.44781 11.5 8.00009 11.5Z"
                          fill="#FF0C46"
                        />
                      </svg>
                    )}
                    {option.default && (
                      <span className="custom-select__outer-menu__item__default">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Aux>
        )}
      </div>
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
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect)
