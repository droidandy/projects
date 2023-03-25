import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import axios from "axios"
import ScreensSelectTemplateItem from "./ScreensSelectTemplateItem"
import {track} from "../../../../../libs/helpers";

class SelectTemplate extends Component {
  state = {
    currentTab: "promo",
    templates: [],
    templatesLoading: true
  };

  allTemplates = [];

  componentWillMount() {
    if (this.props.availableKinds.length > 0) { this.setState({ currentTab: this.props.availableKinds[0] }) }
  }

  tabClasses = (tab) => {
    const { currentTab } = this.state
    return classNames("container-header-menu__item cp", {
      "container-header-menu__item_active": currentTab === tab
    })
  };

  filterScreens = (screensType) => {
    return this.allTemplates.filter((screen) => screen.kind === screensType)
  };

  handleChangeTab = (currentTab) => {
    this.setState({ currentTab, templates: this.filterScreens(currentTab) })
  };

  getTemplates = () => {
    const { user, availableKinds } = this.props
    this.setState({ templatesLoading: true })

    axios.get("/screens/templates").then((response) => {
      let templates = response.data.data.results

      if (availableKinds.length > 0) {
        templates = templates.filter(
          (s) => availableKinds.indexOf(s.kind) > -1
        )
      }

      this.allTemplates = templates
      this.setState({
        templates: this.filterScreens(this.state.currentTab),
        templatesLoading: false
      })
    })
  };

  componentDidMount = this.getTemplates;

  handleChooseScreen = (screenId) => {
    this.props.handleChangeScreenId(screenId)
    track("screen_template_selected", { name: screenId });
  };

  render() {
    const { appId, availableKinds, handleCloseScreensBuilder } = this.props

    const { templatesLoading, templates } = this.state

    return (
      <div className="container-content container-content__blue container-content__purchase-screen">
        <div className="container-content__blue-header container-content__blue-header_menu">
          <div className="container-purchase__screen-select">
            <div className="container-title">
              <svg
                onClick={handleCloseScreensBuilder}
                className="purchase-screen__edit-left__close-icon cp"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
                  fill="#97ADC6"
                />
              </svg>
              <span className="va-middle">Select template</span>
            </div>
            <div className="container-header-menu">
              {/* <div onClick={this.handleChangeTab.bind(null, 'purchase')} className={this.tabClasses('purchase')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="3" width="4" height="2" fill="white"/>
                  <rect x="7" y="2" width="2" height="3" fill="white"/>
                  <rect x="7" y="11" width="2" height="3" fill="white"/>
                  <rect x="5" y="11" width="4" height="2" fill="white"/>
                  <rect x="7" y="7" width="2" height="2" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.87868 8.12132C5.44129 8.68393 6.20435 9 7 9L7 7C6.44772 7 6 6.55228 6 6C6 5.44772 6.44772 5 7 5V3C6.20435 3 5.44129 3.31607 4.87868 3.87868C4.31607 4.44129 4 5.20435 4 6C4 6.79565 4.31607 7.55871 4.87868 8.12132Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.1213 7.87868C10.5587 7.31607 9.79565 7 9 7L9 9C9.55228 9 10 9.44772 10 10C10 10.5523 9.55228 11 9 11V13C9.79565 13 10.5587 12.6839 11.1213 12.1213C11.6839 11.5587 12 10.7956 12 10C12 9.20435 11.6839 8.44129 11.1213 7.87868Z" fill="white"/>
                </svg>
                <span>Initial purchase</span>
              </div> */}
              {(availableKinds.length === 0 ||
                availableKinds.indexOf("promo") > -1) && (
                <div
                  onClick={this.handleChangeTab.bind(null, "promo")}
                  className={this.tabClasses("promo")}
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
                      d="M8.20711 2.25737L12.4498 2.25737C13.002 2.25737 13.4498 2.70508 13.4498 3.25737L13.4498 7.50001C13.4498 7.76522 13.3444 8.01958 13.1569 8.20711L6.37868 14.9853C5.98816 15.3758 5.35499 15.3758 4.96447 14.9853L0.721828 10.7426C0.331304 10.3521 0.331304 9.71896 0.721828 9.32843L7.5 2.55026C7.68754 2.36272 7.94189 2.25737 8.20711 2.25737ZM9.20711 6.50001C9.7929 7.08579 10.7426 7.08579 11.3284 6.50001C11.9142 5.91422 11.9142 4.96447 11.3284 4.37869C10.7426 3.7929 9.7929 3.7929 9.20711 4.37869C8.62132 4.96447 8.62132 5.91422 9.20711 6.50001Z"
                      fill="white"
                    />
                  </svg>
                  <span>Promo offer</span>
                </div>
              )}
              {(availableKinds.length === 0 ||
                availableKinds.indexOf("survey") > -1) && (
                <div
                  onClick={this.handleChangeTab.bind(null, "survey")}
                  className={this.tabClasses("survey")}
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
                      d="M6 14C7.79204 14 9.40058 13.2144 10.5 11.9687C9.56646 10.911 9 9.52167 9 8C9 6.47833 9.56646 5.08896 10.5 4.03126C9.40058 2.78563 7.79204 2 6 2C2.68629 2 0 4.68629 0 8C0 11.3137 2.68629 14 6 14ZM6.55557 7.83147C6.39112 7.94135 6.19778 8 6 8H5.5V9.5H6.5V8.93649C6.6746 8.89141 6.84286 8.82278 7 8.73205C7.03771 8.71028 7.07478 8.68724 7.11114 8.66294C7.44004 8.44318 7.69638 8.13082 7.84776 7.76537C7.99913 7.39992 8.03874 6.99778 7.96157 6.60982C7.8844 6.22186 7.69392 5.86549 7.41421 5.58579C7.13451 5.30608 6.77814 5.1156 6.39018 5.03843C6.00222 4.96126 5.60009 5.00087 5.23463 5.15224C4.86918 5.30362 4.55682 5.55996 4.33706 5.88886C4.31276 5.92522 4.28972 5.96229 4.26795 6C4.0928 6.30337 4 6.64817 4 7H5C5 6.80222 5.05865 6.60888 5.16853 6.44443C5.27841 6.27998 5.43459 6.15181 5.61732 6.07612C5.80004 6.00043 6.00111 5.98063 6.19509 6.01922C6.38907 6.0578 6.56725 6.15304 6.70711 6.29289C6.84696 6.43275 6.9422 6.61093 6.98079 6.80491C7.01937 6.99889 6.99957 7.19996 6.92388 7.38268C6.84819 7.56541 6.72002 7.72159 6.55557 7.83147ZM6.64999 10.625C6.64999 10.9702 6.37017 11.25 6.02499 11.25C5.67982 11.25 5.39999 10.9702 5.39999 10.625C5.39999 10.2798 5.67982 10 6.02499 10C6.37017 10 6.64999 10.2798 6.64999 10.625ZM16 3H12V5H16V3ZM11 7H16V9H11V7ZM16 11H12V13H16V11Z"
                      fill="white"
                    />
                  </svg>
                  <span>Survey</span>
                </div>
              )}
              {(availableKinds.length === 0 ||
                availableKinds.indexOf("feedback") > -1) && (
                <div
                  onClick={this.handleChangeTab.bind(null, "feedback")}
                  className={this.tabClasses("feedback")}
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
                      d="M0 4C0 2.34315 1.34315 1 3 1H13C14.6569 1 16 2.34315 16 4V9C16 10.6569 14.6569 12 13 12H9L4 16V12H3C1.34315 12 0 10.6569 0 9V4ZM8.55557 5.83147C8.39112 5.94135 8.19778 6 8 6H7.5V7.5H8.5V6.93649C8.6746 6.89141 8.84286 6.82278 9 6.73205C9.03771 6.71028 9.07478 6.68724 9.11114 6.66294C9.44004 6.44318 9.69638 6.13082 9.84776 5.76537C9.99913 5.39992 10.0387 4.99778 9.96157 4.60982C9.8844 4.22186 9.69392 3.86549 9.41421 3.58579C9.13451 3.30608 8.77814 3.1156 8.39018 3.03843C8.00222 2.96126 7.60009 3.00087 7.23463 3.15224C6.86918 3.30362 6.55682 3.55996 6.33706 3.88886C6.31276 3.92522 6.28972 3.96229 6.26795 4C6.0928 4.30337 6 4.64817 6 5H7C7 4.80222 7.05865 4.60888 7.16853 4.44443C7.27841 4.27998 7.43459 4.15181 7.61732 4.07612C7.80004 4.00043 8.00111 3.98063 8.19509 4.01922C8.38907 4.0578 8.56725 4.15304 8.70711 4.29289C8.84696 4.43275 8.9422 4.61093 8.98079 4.80491C9.01937 4.99889 8.99957 5.19996 8.92388 5.38268C8.84819 5.56541 8.72002 5.72159 8.55557 5.83147ZM8.64999 8.625C8.64999 8.97018 8.37017 9.25 8.02499 9.25C7.67982 9.25 7.39999 8.97018 7.39999 8.625C7.39999 8.27982 7.67982 8 8.02499 8C8.37017 8 8.64999 8.27982 8.64999 8.625Z"
                      fill="white"
                    />
                  </svg>
                  <span>Feedback</span>
                </div>
              )}
              {(availableKinds.length === 0 ||
                availableKinds.indexOf("billing_issue") > -1) && (
                <div
                  onClick={this.handleChangeTab.bind(null, "billing_issue")}
                  className={this.tabClasses("billing_issue")}
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
                      d="M16 4C16 6.20914 14.2091 8 12 8C9.79086 8 8 6.20914 8 4C8 1.79086 9.79086 0 12 0C14.2091 0 16 1.79086 16 4ZM11.375 1.13V4.63H12.625V1.13H11.375ZM12 6.87498C12.4832 6.87498 12.875 6.48323 12.875 5.99998C12.875 5.51674 12.4832 5.12498 12 5.12498C11.5168 5.12498 11.125 5.51674 11.125 5.99998C11.125 6.48323 11.5168 6.87498 12 6.87498ZM2 3H7.10002C7.03443 3.32311 7 3.65753 7 4C7 4.34247 7.03443 4.67689 7.10002 5H1V4C1 3.44772 1.44772 3 2 3ZM1 6H7.41604C8.1876 7.7659 9.94968 9 12 9C13.1256 9 14.1643 8.62806 15 8.00037V12C15 12.5523 14.5523 13 14 13H2C1.44772 13 1 12.5523 1 12V6Z"
                      fill="white"
                    />
                  </svg>
                  <span>Billing issue</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container-content__blue-content container-content__blue-content_ps">
          <div className="container-purchase__screen-select">
            {(templatesLoading || templates.length) > 0 && (
              <div className="purchase-screens__templates">
                {templatesLoading && (
                  <div
                    className="animated-background timeline-item"
                    style={{ width: 320, height: 570, marginBottom: 30 }}
                  />
                )}
                {templates.map((screen, index) => (
                  <ScreensSelectTemplateItem
                    appId={appId}
                    key={index}
                    handleChooseScreen={this.handleChooseScreen}
                    options={true}
                    screen={screen}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTemplate)
