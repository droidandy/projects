import React, { Component } from "react"
import { connect } from "react-redux"
import ReactMarkdown from 'react-markdown'
import { NavLink } from "react-router-dom"
import history from "../../../history"
import { NotificationManager } from "../../../libs/Notifications"
import Modal from "react-modal"
import classNames from "classnames"
import axios from "axios"
import Tabs from "../../Common/Tabs/Tabs"
import Tab from "../../Common/Tabs/Tab"
import Code from "../../Common/Code"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { fetchApplicationRequest } from "../../../actions/application"
import { getTutorial } from "../../../actions/tutorials"
import {track} from "../../../libs/helpers";

class ConfigureAppStep1 extends Component {
  state = {
    popupOpen: false,
    successPopupOpen: false,
    email: "",
    tutorialData: [],
    appId: '',
    // platform: 'ios',
    loading: false,
    currentTab: 0
  }

  next = (e) => {
    history.push({
      pathname: `/configureapp/${this.props.match.params.appId}/2`,
      search: this.props.history.location.search,
    })
  }

  componentWillMount() {
  }

  componentDidMount() {
    document.title = "Apphud | Configure app"
    this.setState({
      loading: true
    });

    const { api_key, bundle_id } = this.props.newapp
    const platform = bundle_id ? 'ios' : 'android';

    this.props.getTutorial(platform, (tutorial) => {
      this.setState({
        tutorialData: tutorial,
        api_key,
        loading: false,
        platform,
      })
    });

    window.scrollTo(0, 0)
  }

  handleShowPopup = () => {
    this.setState({
      popupOpen: true,
      email: "",
    })
  }

  handleClosePopup = () => {
    this.setState({ popupOpen: false })
  }

  handleSuccessClosePopup = () => {
    this.setState({ successPopupOpen: false })
  }

  handleChangeEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  emailValidation = () => {
    // eslint-disable-next-line
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/.test(
      this.state.email
    )
  }

  inputEmailClasses = () => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && !this.emailValidation(),
    })
  }

  sendEmail = () => {
    this.setState({ submitted: true })

    if (this.emailValidation()) {
      axios
        .post(`/apps/${this.props.match.params.appId}/sdk_instructions`, {
          email: this.state.email,
        })
        .then(() => {
          this.handleClosePopup()
          this.setState({
            submitted: false,
            successPopupOpen: true,
          })
        })
        .catch(() => {
          NotificationManager.success("Something went wrong :(", "OK", 5000)
        })
    }
  }

  onTabChange = (currentTab) => {
    this.setState({ currentTab })
  }

  replaceAppId = s => s.replace('{API_KEY}', this.state.api_key)

  setPlatform = (platform) => {
    this.setState({
      platform,
      loading: true
    });

    this.props.getTutorial(platform, (tutorialData) => {
      this.setState({
        tutorialData,
        loading: false
      })
    });
  }

  mapServerResponceToMarkUp = (data) => {
    return (
      <div>
        {data.map(item => {
          if (item.type === 'notice') {
            return (
              <div className="newapp-content__notice">
                {<ReactMarkdown source={item.content} />}
              </div>
            );
          } else if (item.type === 'alert') {
            return (
              <div className="newapp-content__paragraph">
                {<ReactMarkdown source={item.content} />}
              </div>
            );
          } else if (item.type === 'paragraph') {
            return (
              <div className="newapp-content__paragraph">
                {<ReactMarkdown source={item.content} />}
              </div>
            );
          } else if (item.type === 'code') {
            return (
              <Code
                label={<pre style={{ fontSize: '15px', tabSize: 4 }}>{this.replaceAppId(item.content)}</pre>}
                copyContent={item.content}
                className="mb15"
                onCodeCopied={() => {
                  track("onboarding_sdk_sample_copied");
                }}
              />
            );
          } else if (item.type === 'tabs') {
            return (
              <Tabs contentClassName="newapp-tabcontent mb15">
                {item.tabs.map(tab => (
                  <Tab title={tab.title}>
                    {this.mapServerResponceToMarkUp(tab.content)}
                  </Tab>
                ))}
              </Tabs>
            )
          } else if (item.type === 'code-tabs') {
            return (
              <Tabs contentClassName="newapp-tabcontent mb15" currentTab={this.state.currentTab} onChange={this.onTabChange}>
                {item.content.map(tab => (
                  <Tab title={tab.title}>
                    <Code
                      label={<pre style={{ fontSize: '15px', tabSize: 4 }}>{tab.content.map(item => {
                        if (item.type === 'code-comment') {
                          return (
                            <span style={{ color: "#97adc6", fontWeight: "normal", overflow: 'auto' }}>
                              {this.replaceAppId(item.content)}
                            </span>
                          );
                        } else if (item.type === 'code') {
                          return <div style={{ 'overflow': 'auto' }}>{this.replaceAppId(item.content)}</div>;
                        }
                      })}</pre>}
                      copyContent={Array.isArray(tab.content) ? tab.content.reduce((res, content) => content ? res + this.replaceAppId(content.content) : '', '') : tab.content}
                      className="mb15"
                      onCodeCopied={() => {
                        track("onboarding_sdk_sample_copied");
                      }}
                    />
                  </Tab>
                ))}
              </Tabs>
            )
          }
        })}
      </div>
    )
  }

  render() {
    const { currentTab } = this.state
    return (
      <>
        <div className="container-content__wrapper pt0">
          <div className="left-subbar">
            <div className="left-subbar__item_category">
              PLATFORMS
          </div>
            <div
              className={`left-subbar__item ${this.state.platform === 'ios' ? 'left-subbar__item_active' : ''}`}
              onClick={() => this.setPlatform('ios')}
            >
              <span>iOS</span>
            </div>
            <div
              className={`left-subbar__item ${this.state.platform === 'android' ? 'left-subbar__item_active' : ''}`}
              onClick={() => this.setPlatform('android')}
            >
              <span>Android</span>
            </div>
          </div>
          <div className="container-content__blue-content pt0 pr0">
            {this.state.loading ? (
              <>
                <div className="animated-background timeline-item" /> <br />
                <div className="animated-background timeline-item" /> <br />
                <div className="animated-background timeline-item" /> <br />
                <div className="animated-background timeline-item" />
              </>
            ) : this.mapServerResponceToMarkUp(this.state.tutorialData)}
            {/*<div className="input-wrapper ta-right">*/}
            {/*
          <button onClick={this.handleShowPopup} className="newapp-bottom__button-with-margin button button_blue button_255">
            <span>Send instructions to developer</span>
          </button>
          */}

            {/*</div>*/}
            {/*
        <Modal
          isOpen={this.state.popupOpen}
          onRequestClose={this.handleClosePopup}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Send instructions">
          <div style={{padding: '20px 30px'}}>
            <div className="newapp-header__title">Send instructions</div>
            <div className="input-wrapper">
              <label className={"l-p__label"} htmlFor="login">Send instructions to email</label>
              <div className="input-wrapper__required">
                <input
                  onChange={this.handleChangeEmail}
                  value={this.state.email}
                  autoFocus={true}
                  className={this.inputEmailClasses()}
                  placeholder="Email"
                />
                <span className="required-label">Required</span>
              </div>
            </div>
            <div className="input-wrapper">
              <button className="button button_blue popup-button fl" onClick={this.handleClosePopup}>
                <span>Cancel</span>
              </button>
              <button onClick={this.sendEmail} className="button button_green popup-button fr">
                <span>Send</span>
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.successPopupOpen}
          onRequestClose={this.handleSuccessClosePopup}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Send instructions">
          <div style={{padding: '20px 30px'}}>
            <div className="newapp-header__title">Instructions sent</div>
            <div className="input-wrapper">
              Apphud integration instructions were successfully sent!
            </div>
            <div className="input-wrapper ta-center">
              <button className="button button_green button_160" onClick={this.handleSuccessClosePopup}>
                <span>OK</span>
              </button>
            </div>
          </div>
        </Modal>
        */}
          </div>
        </div>

      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    newapp: state.application,
    user: state.sessions,
  }
}

const mapDispatchToProps = {
  fetchApplicationRequest,
  getTutorial
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureAppStep1)
