import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../history"
import Tip from "./Tip"
import axios from "axios"
import { NotificationManager } from "../../libs/Notifications"

import {
  updateApplicationRequest,
  fetchApplicationRequest
} from "../../actions/application"
import {track} from "../../libs/helpers";

const MAX_FILE_SIZE = 1
const ALLOWED_FILE_TYPES = [".p8"]

class Push extends Component {
  state = {
    application: {}
  };

  getApp = () => {
    this.props.fetchApplicationRequest(this.props.appId, (application) => {
      this.setState({ application })
    })
  };

  componentDidMount() {
    document.title = "Apphud | Push"
    this.getApp()
  }

  t = new Date().getTime();

  handleChangeTeamId = (e) => {
    const { application } = this.state
    application.apple_team_id = e.target.value
    this.setState({ application })
  };

  handleChangeKeyId = (e) => {
    const { application } = this.state
    application.apns_auth_key_id = e.target.value
    this.setState({ application })
  };

  handleSubmit = (e) => {
    const {
      apns_auth_key,
      apns_auth_key_id,
      apple_team_id
    } = this.state.application
    const params = {
      ...JSON.parse(JSON.stringify(this.state.application)),
      id: this.props.appId
    }
    this.setState({ submitted: true })

    if (apns_auth_key_id && apple_team_id) {
      this.setState({ saving: true })

      if (this.state.file) this.upload()

      if (!apns_auth_key) params.remove_apns_auth_key = true

      this.props.updateApplicationRequest(params, (app) => {
        this.setState({ submitted: false })
        this.getApp()

        if (this.props.onSaveCallback) {
          NotificationManager.success(
            "Certificate successfully saved",
            "OK",
            5000
          )
          this.props.onSaveCallback()
        } else {
          NotificationManager.success("App successfully saved", "OK", 5000)
          this.setState({ saving: false })
        }

        if (this.props.close) this.props.close()
      })
    }
  };

  hasExtension = (fileName, exts) => {
    return new RegExp("(" + exts.join("|").replace(/\./g, "\\.") + ")$").test(
      fileName
    )
  };

  getExt = (name) => {
    const patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i
    return name.match(patt1)[0]
  };

  upload = (cb = () => {}) => {
    const certificateFile = this.state.file
    const self = this

    return new Promise((resolve, reject) => {
      const imageFormData = new FormData()
      imageFormData.append("apns_auth_key", certificateFile)
      imageFormData.append(
        "apns_auth_key_id",
        this.state.application.apns_auth_key_id
      )
      const url = `${axios.defaults.baseURL}/apps/${this.props.appId}`

      axios
        .put(url, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((data) => {
          cb()
        })
        .catch(() => {
          self.setState({
            file: ""
          })
        })
    })
  };

  removeAppleAuthKey = () => {
    const { application } = this.state
    application.apns_auth_key = null
    this.setState({ application })
  };

  _handleImageChange = (e) => {
    e.preventDefault()

    const file = e.target.files[0]
    const { application } = this.state
    let keyId

    if (!file) return

    const imageMbSize = file.size / 1024 / 1024

    if (imageMbSize > MAX_FILE_SIZE) {
      NotificationManager.error(
        `File size exceeds ${MAX_FILE_SIZE} MB`,
        "Error",
        5000
      )
      this.setState({
        file: ""
      })
      return
    }

    if (!this.hasExtension(file.name, ALLOWED_FILE_TYPES)) {
      NotificationManager.error("File type is not allowed", "Error", 5000)
      this.setState({
        file: ""
      })
      return
    }

    if (file.name.indexOf("AuthKey_") > -1) {
      const splitName = file.name.split("_")
      if (splitName[1]) {
        keyId = splitName[1].replace(this.getExt(file.name), "")
        application.apns_auth_key_id = keyId
      }
    }

    application.apns_auth_key = file.name
    this.setState({ file, application })
  };

  fieldClasses = (name) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && !this.state.application[name]
    })
  };

  render() {
    const { close } = this.props
    const {
      apns_auth_key,
      apns_auth_key_id,
      apple_team_id,
      saving,
      file
    } = this.state.application
    return (
      <div className="container-content__appsettings-uploader">
        <div>
          <div className="container-content__appsettings-uploader__title">
            APNs authentication *.p8 key (Sandbox & Production)
          </div>
          <Tip
            title="APNs authentication key"
            description="Establish connectivity between Apphud and the Apple Push Notification service. One key is used for all of your apps."
            buttonUrl="https://docs.apphud.com/getting-started/push"
          />
        </div>
        {apns_auth_key ? (
          <div>
            <div className="container-content__appsettings-uploader__file-name">
              {apns_auth_key}
            </div>
            <button
              onClick={this.removeAppleAuthKey}
              className="button button_red l-p__button"
              style={{ marginTop: 0 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 3.33267V2H6V3H2V5H14V3.33267H10Z" fill="white" />
                <path
                  d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                  fill="white"
                />
              </svg>
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <form
            className="se__s-p__uploader-form"
            id={"uploadForm__" + this.t}
            name="uploadForm"
          >
            <label
              htmlFor={"uploadFile" + this.t}
              className="button button_blue button_inline button_160 container-content__appsettings-uploader__button"
            >
              Upload file
            </label>
            <input
              id={"uploadFile" + this.t}
              className="hidden"
              name="file"
              type="file"
              onChange={this._handleImageChange}
            />
          </form>
        )}
        <div style={{ maxWidth: 350 }}>
          <div className="input-wrapper">
            <label
              className="l-p__label l-p__label_inline"
              style={{ marginRight: 5 }}
              htmlFor="KeyId"
            >
              Authentication key identifier
            </label>
            <div className="input-wrapper__required">
              <input
                value={apns_auth_key_id || ""}
                onChange={this.handleChangeKeyId}
                id="KeyId"
                placeholder="Key identifier"
                type="text"
                name="KeyId"
                className={this.fieldClasses("apns_auth_key_id")}
              />
              <span className="required-label">Required</span>
            </div>
          </div>
          <div className="input-wrapper">
            <label
              className="l-p__label l-p__label_inline"
              style={{ marginRight: 5 }}
              htmlFor="teamId"
            >
              Team ID
            </label>
            <Tip
              title="Team ID"
              description={
                <>
                  You may find Team ID on
                  <a
                      onClick={()=> track("ios_push_settings_team_id_link_clicked")}
                      className="link"
                      href="https://developer.apple.com/account/#/membership"
                      target="_blank">Apple Developer Membership Details page.</a>
                </>
              }/>
                <div className="input-wrapper__required">
                  <input
                      value={apple_team_id || ""}
                      onChange={this.handleChangeTeamId}
                      id="teamId"
                      placeholder="Team ID"
                      type="text"
                      name="teamId"
                      className={this.fieldClasses("apple_team_id")}
                  />
                  <span className="required-label">Required</span>
                </div>
                </div>
              }
          {close && (
            <button
              className="button button_blue l-p__button"
              style={{ marginRight: 30 }}
              onClick={close}
            >
              <span>Cancel</span>
            </button>
          )}
          <button
            disabled={saving || (close && !file && !apns_auth_key)}
            className="button button_green l-p__button"
            onClick={this.handleSubmit}
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
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application,
    sessions: state.sessions
  }
}

const mapDispatchToProps = {
  updateApplicationRequest,
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Push)
