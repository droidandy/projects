import React, { Component } from "react"
import { connect } from "react-redux"
import Tip from "./Tip"
import axios from "axios"
import { NotificationManager } from "../../libs/Notifications"
import { fetchApplicationRequest } from "../../actions/application"

const MAX_FILE_SIZE = 1
const ALLOWED_FILE_TYPES = [".p8"]

class SubscriptionCertificateUploader extends Component {
  state = {
    keyId: ""
  };

  t = new Date().getTime();

  hasExtension = (fileName, exts) => {
    return new RegExp("(" + exts.join("|").replace(/\./g, "\\.") + ")$").test(
      fileName
    )
  };

  getExt = (name) => {
    const patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i
    return name.match(patt1)[0]
  };

  uploaded = (response) => {
    this.props.fetchApplicationRequest(this.props.application.id, () => {
      this.setState({
        keyId: "",
        file: "",
        showInput: false
      })
    })
  };

  upload = () => {
    const certificateFile = this.state.file

    if (!certificateFile) return

    const imageMbSize = certificateFile.size / 1024 / 1024
    const self = this

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

    if (!this.hasExtension(certificateFile.name, ALLOWED_FILE_TYPES)) {
      NotificationManager.error("File type is not allowed", "Error", 5000)
      this.setState({
        file: ""
      })
      return
    }

    this.setState({
      showInput: false
    })

    let keyId

    if (!this.state.keyId) {
      if (certificateFile.name.indexOf("SubscriptionKey_") > -1) {
        const splitName = certificateFile.name.split("_")

        if (splitName[1]) { keyId = splitName[1].replace(this.getExt(certificateFile.name), "") } else {
          this.setState({
            showInput: true
          })
          return
        }
      } else {
        this.setState({
          showInput: true
        })
        return
      }
    } else keyId = this.state.keyId

    if (this.props.forceUpload) {
      return new Promise((resolve, reject) => {
        const imageFormData = new FormData()
        imageFormData.append(this.props.data, certificateFile)
        imageFormData.append(this.props.keyIdProp, keyId)

        axios
          .put(this.props.url, imageFormData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then((data) => {
            self.uploaded(data)
          })
          .catch(() => {
            self.setState({
              file: ""
            })
          })
      })
    } else {
      this.props.onChange({ file: certificateFile, keyId })
    }
  };

  _handleFileChange = (e) => {
    e.preventDefault()

    const file = e.target.files[0]
    this.setState(
      {
        keyId: "",
        showInput: false,
        file: file
      },
      this.upload
    )
  };

  handleChangeKeyId = (e) => {
    this.setState({ keyId: e.target.value })

    if (!this.props.forceUpload) { this.props.onChange({ file: this.state.file, keyId: e.target.value }) }
  };

  render() {
    const { title, subtitle, currentValue, tip, forceUpload } = this.props
    const { keyId, showInput, file } = this.state
    return (
      <div>
        <div className="container-content__appsettings-uploader">
          <div>
            <div className="container-content__appsettings-uploader__title">
              {subtitle}
            </div>
            <Tip
              title={tip.title}
              description={tip.description}
              buttonUrl={tip.url}
            />
          </div>
          {currentValue || file ? (
            <div>
              <div className="container-content__appsettings-uploader__file-name">
                {currentValue || file.name}
              </div>
              {this.props.removeFunc && (
                <button
                  onClick={this.props.removeFunc}
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
                    <path
                      d="M10 3.33267V2H6V3H2V5H14V3.33267H10Z"
                      fill="white"
                    />
                    <path
                      d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                      fill="white"
                    />
                  </svg>
                  <span>Remove</span>
                </button>
              )}
            </div>
          ) : (
            <form
              className="se__s-p__uploader-form"
              id={"uploadForm__" + this.t}
              name="uploadForm"
              onSubmit={this._handleSubmit}
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
                onChange={this._handleFileChange}
              />
            </form>
          )}
          {showInput && (
            <div>
              <div className="input-wrapper container-content__appsettings-uploader__input-wrapper ta-left">
                <label
                  className="l-p__label l-p__label_inline"
                  style={{ marginRight: 5 }}
                  htmlFor="KeyId"
                >
                  Apple subscription key ID
                </label>
                <Tip
                  title={"Subscription key ID"}
                  description='A string that identifies the private key you use to generate the signature. You can find this identifier in App Store Connect <a href="https://appstoreconnect.apple.com/access/api/subs" target="_blank" class="link">Users and Access > Keys</a>, in the KEY ID column for the subscription key you generated.'
                  buttonUrl="https://appstoreconnect.apple.com/access/api/subs"
                />
                <input
                  value={keyId}
                  onChange={this.handleChangeKeyId}
                  id="KeyId"
                  placeholder="E.g. JUSHXOAMXE"
                  type="KeyId"
                  name="KeyId"
                  className={"input input_stretch input_blue"}
                />
              </div>
              {forceUpload && (
                <button
                  className="button button_blue container-content__appsettings-uploader__input-wrapper-button"
                  onClick={this.upload}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sessions: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchApplicationRequest
}

SubscriptionCertificateUploader.defaultProps = {
  currentValue: "",
  title: "",
  subtitle: "",
  method: "",
  data: "",
  url: "",
  tip: {},
  onUploadSuccess: () => {},
  removeFunc: () => {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionCertificateUploader)
