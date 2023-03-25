import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import SubscriptionCertificateUploader from "./SubscriptionCertificateUploader"
import { fetchApplicationRequest } from "../../actions/application"
import axios from "axios"

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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100
  }
}

class OfferSignatureModal extends Component {
  state = {
    file: null,
    uploading: false
  };

  handleSave = () => {
    const self = this
    const { file, keyId } = this.state
    const { appId, sessions } = this.props

    this.setState({ uploading: true })

    return new Promise((resolve, reject) => {
      const imageFormData = new FormData()
      imageFormData.append("apple_subscription_key", file)
      imageFormData.append("apple_subscription_key_id", keyId)

      axios
        .put(`/apps/${appId}`, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((data) => {
          self.uploadCertificateSuccess(data)
        })
        .catch(() => {
          self.setState({
            file: ""
          })
        })
    })
  };

  uploadCertificateSuccess = () => {
    const { appId, onSuccess } = this.props

    this.props.fetchApplicationRequest(appId, () => {
      this.setState({ uploading: false }, onSuccess)
    })
  };

  onChange = ({ file, keyId }) => {
    this.setState({ file, keyId })
  };

  render() {
    const { appId, close, application } = this.props
    const { file, keyId, uploading } = this.state
    return (
      <Modal
        isOpen={true}
        onRequestClose={close}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Upload Auth Key"
      >
        <div style={{ padding: "20px 30px" }}>
          <div className="newapp-header__title">Upload signature</div>
          <div className="input-wrapper">
            <SubscriptionCertificateUploader
              currentValue={application.apple_subscription_key}
              subtitle="Subscription key file"
              data="apple_subscription_key"
              keyIdProp="apple_subscription_key_id"
              forceUpload={false}
              onChange={this.onChange}
              removeFunc={false}
              url={`/apps/${appId}`}
              tip={{
                title: "Subscription key ID",
                description:
                  'A string that identifies the private key you use to generate the signature. You can find this identifier in App Store Connect <a href="https://appstoreconnect.apple.com/access/api/subs" target="_blank" class="link">Users and Access > Keys</a>, in the KEY ID column for the subscription key you generated.',
                buttonUrl: "https://appstoreconnect.apple.com/access/api/subs"
              }}
            />
          </div>
          <div className="input-wrapper">
            <button
              className="button button_blue popup-button fl"
              onClick={close}
            >
              <span>Cancel</span>
            </button>
            <button
              disabled={!file || !keyId || uploading}
              className="button button_green popup-button fr"
              onClick={this.handleSave}
            >
              <span>{uploading ? "Uploading..." : "Save"}</span>
            </button>
          </div>
        </div>
      </Modal>
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
  fetchApplicationRequest
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OfferSignatureModal)
