import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import Aux from "../../../../../../../hoc/Aux"
import { NotificationManager } from "../../../../../../../libs/Notifications"

const MAX_FILE_SIZE = 10
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg+xml"
]

class ScreenImageUploader extends Component {
  t = new Date().getTime();

  constructor(props) {
    super(props)
    this.state = {
      file: "",
      loading: false
    }
    this._handleImageChange = this._handleImageChange.bind(this)
  }

  t = new Date().getTime();

  uploaded = (response) => {
    this.props.onChange(response.data.data.results.url)
    this.setState(
      {
        loading: false
      },
      () => {
        document.getElementById("uploadForm" + this.t) &&
          document.getElementById("uploadForm" + this.t).reset()
      }
    )
  };

  uploadImage = () => {
    const imageFile = this.state.file
    if (imageFile) {
      const imageMbSize = imageFile.size / 1024 / 1024

      if (imageMbSize > MAX_FILE_SIZE) {
        NotificationManager.error(
          `File size exceeds ${MAX_FILE_SIZE} MB`,
          "Error",
          5000
        )
        this.setState({
          loading: false,
          file: ""
        })
        return
      }

      if (ALLOWED_FILE_TYPES.indexOf(imageFile.type) === -1) {
        NotificationManager.error("File type is not allowed", "Error", 5000)
        this.setState({
          loading: false,
          file: ""
        })
        return
      }
    } else {
      return
    }

    const self = this
    return new Promise((resolve, reject) => {
      const imageFormData = new FormData()
      const url = `${axios.defaults.baseURL}/upload_asset`
      imageFormData.append("data", imageFile)

      axios
        .post(url, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((data) => {
          self.uploaded(data)
        })
        .catch(() => {
          self.setState(
            {
              loading: false
            },
            this.forceUpdate
          )
        })
    })
  };

  _handleImageChange(e) {
    e.preventDefault()
    const file = e.target.files[0]
    this.setState(
      {
        file,
        loading: true
      },
      this.uploadImage
    )
  }

  _removeImage = () => {
    this.props.onChange("")
    this.setState({
      file: ""
    })
  };

  render() {
    const { loading } = this.state

    return (
      <Aux>
        {loading === true && <div className="colorpicker-overlay" />}
        <div className="screen-uploader">
          <form
            className={
              "screen-uploader__form " +
              (this.props.fieldNotValid && " screen-uploader__form_error")
            }
            id={"uploadForm" + this.t}
            name="uploadForm"
          >
            <input
              id={`uploadFile${this.t}`}
              className="hidden"
              name="file"
              type="file"
              onChange={this._handleImageChange}
            />
            <label
              className="button button_blue button_160 screen-uploader__form-button"
              htmlFor={`uploadFile${this.t}`}
            >
              <svg
                className="va-middle"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3ZM7 5C7 6.10457 6.10457 7 5 7C3.89543 7 3 6.10457 3 5C3 3.89543 3.89543 3 5 3C6.10457 3 7 3.89543 7 5ZM3 13L6 9L7.5 11L10 7L13 13H3Z"
                  fill="white"
                />
              </svg>
              {loading ? (
                <span className="va-middle">Uploading...</span>
              ) : (
                <span className="va-middle">
                  {this.props.value ? "Change" : "Upload"}
                </span>
              )}
            </label>
            {this.props.value && (
              <div
                className="screen-uploader__form-reset button button_red"
                onClick={this._removeImage}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2V1H6V2H2V4H14V2H10Z" fill="white" />
                  <path
                    d="M3 5V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V5H3ZM7.5 12.5H6V7.5H7.5V12.5ZM10 12.5H8.5V7.5H10V12.5Z"
                    fill="white"
                  />
                </svg>
              </div>
            )}
          </form>
        </div>
      </Aux>
    )
  }
}

const mapStateToProps = (state) => ({
  sessions: state.sessions
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenImageUploader)
