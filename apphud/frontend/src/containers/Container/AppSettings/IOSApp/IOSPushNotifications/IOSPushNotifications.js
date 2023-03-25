import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import classNames from "classnames"
import moment from 'moment';

import Input from "../../../../../components/Input"
import Tip from "../../../../Common/Tip"
import { NotificationManager } from "../../../../../libs/Notifications"
import { fetchApplicationRequest, updateApplicationRequest } from "../../../../../actions/application"
import { fetchApplicationsRequest } from "../../../../../actions/applications"
import {track} from "../../../../../libs/helpers";

const MAX_FILE_SIZE = 1
const ALLOWED_FILE_TYPES = [".p8"]

class IOSPushNotifications extends Component {
  state = {
    application: {},
    loadingFile: false,
    loading: false
  };

  getApp = (cb) => {
      this.setState({ application: this.props.application, loadingFile: false, loading: false });
      if (cb) cb();
  };

  componentDidMount() {
    document.title = "Apphud | iOS push notifications"
    this.getApp()
  }

  t = new Date().getTime();

  handleChangeTeamId = (value) => {
    const { application } = this.state
    application.apple_team_id = value;
    this.setState({ application })
  };

  handleChangeKeyId = (value) => {
    const { application } = this.state
    application.apns_auth_key_id = value;
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
      id: this.props.match.params.appId
    }
    this.setState({ submitted: true })

    if (!apns_auth_key || (apns_auth_key_id && apple_team_id)) {
      this.setState({ saving: true })

      this.props.updateApplicationRequest(params, (app) => {
        this.setState({ submitted: false })
        this.getApp()

        track("ios_push_settings_saved", app);
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
        this.state.application.apns_auth_key_id || ''
      )
      const url = `${axios.defaults.baseURL}/apps/${this.props.match.params.appId}`

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
    this.setState({
      loadingFile: true
    });
    this.props.updateApplicationRequest({
        id: this.props.match.params.appId,
        apns_auth_key: ''
      },
      () => { this.getApp(() => NotificationManager.success("Key successfully removed", "OK", 5000))},
      () => this.setState({loadingFile: false}),
      true
    );
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

    this.setState({
      file,
      apns_auth_key: file.name,
      loadingFile: true
    }, () => {
      this.upload(() => {
        this.getApp(() => NotificationManager.success("Key successfully added", "OK", 5000));
      });
    });
  };

  fieldClasses = (name) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && !this.state.application[name]
    })
  };

  getIsRequiredError = (field) => {
    const invalid = this.state.submitted && !this.state.apns_auth_key && !this.state.application[field];

    return invalid ? [field] : [];
  }

  render() {
    const {
      apns_auth_key,
      apns_auth_key_id,
      apple_team_id,
      saving
    } = this.state.application;

    const {
      last_push_sent_at
    } = this.props.application;

    const last_push_sent_at_string = last_push_sent_at ?
      `${moment(last_push_sent_at).format('YYYY-MM-DD HH:MM:SS')} UTC`
      :
      'Never';

    return (
      <>
        <div className="container-content__blue-header pr15">
          <div className="container-title">
            <span className="va-middle text-black">iOS push notifications</span>
          </div>
          <button
            disabled={saving}
            onClick={this.handleSubmit}
            className="button button_green l-p__button fr mt0"
          >
            <span>Save</span>
          </button>
        </div>
        <div className="container-content__blue-content">
          <div className="container-content__notification">
            Win back lapsed customers and reduce churn by sending Push-notifications through Rules.
          </div>
          <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_uploader">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.0104 2.90382L12.5962 1.48961L7.55732 6.52846C6.02341 5.62253 4.01461 5.82853 2.69668 7.14646C1.13458 8.70856 1.13458 11.2412 2.69668 12.8033C4.25878 14.3654 6.79144 14.3654 8.35353 12.8033C9.67147 11.4854 9.87747 9.47658 8.97153 7.94268L10.1213 6.79291L11.5355 8.20712L12.5962 7.14646L11.182 5.73225L12.2426 4.67159L13.6568 6.0858L14.7175 5.02514L13.3033 3.61093L14.0104 2.90382ZM6.93932 11.3891C6.15827 12.1701 4.89194 12.1701 4.11089 11.3891C3.32984 10.6081 3.32984 9.34172 4.11089 8.56067C4.89194 7.77963 6.15827 7.77963 6.93932 8.56067C7.72037 9.34172 7.72037 10.6081 6.93932 11.3891Z"
                  fill="#97ADC6"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>APNs authentication key</span>
          </div>
          <div className="container-content__appsettings-uploader">
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
              <div className="warning">Important: Do not rename subscription key file when uploading.</div>
              <div className="appsettings-container__form">
                <Input
                  label='Last push sent at'
                  value={last_push_sent_at_string}
                  type='text'
                  plain
                  readOnly
                />
                <Input
                  label='Authentication key identifier'
                  value={apns_auth_key_id || ''}
                  onChange={({ value }) => this.handleChangeKeyId(value.trim())}
                  type='text'
                  id='apns_auth_key_id'
                  name="apns_auth_key_id"
                  required={apns_auth_key}
                  errors={apns_auth_key ? this.getIsRequiredError('apns_auth_key_id') : []}
                  placeholder="Key identifier"
                  autoComplete="new-password"
                />
                <Input
                  label='Team ID'
                  value={apple_team_id || ''}
                  onChange={({ value }) => this.handleChangeTeamId(value.trim())}
                  type='text'
                  id='apple_team_id'
                  name="apple_team_id"
                  required={apns_auth_key}
                  errors={apns_auth_key ? this.getIsRequiredError('apple_team_id') : []}
                  placeholder="Team ID"
                  bottomText={<>You may find Team ID on <a className="link"  onClick={()=> track("ios_push_settings_team_id_link_clicked")} href="https://developer.apple.com/account/#/membership" target="_blank">Apple Developer Membership Details page.</a></>}
                />
              </div>
            </div>
          </div>
        </div>
      </>
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
  fetchApplicationRequest,
  fetchApplicationsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(IOSPushNotifications)
