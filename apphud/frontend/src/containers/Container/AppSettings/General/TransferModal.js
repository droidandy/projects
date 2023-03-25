import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import classNames from "classnames"
import Input from "../../../Common/Input"
import InputRadio from "../../../Common/InputRadio"
import {track, validation} from "../../../../libs/helpers"
import axios from "axios"
import { fetchApplicationRequest } from "../../../../actions/application"

const customStylesPopUp = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 410,
    overlfow: "visible"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100
  }
}

class TransferModal extends Component {
  state = {
    email: "",
    submitted: false,
    loading: false
  };

  inviteRequest = (cb, params) => {
    const { appId } = this.props

    axios.post(`/apps/${appId}/invites?grant=1`, params).then(
      (response) => {
        const data = response.data.data.results
        cb(data)
      },
      () => {
        this.setState({ loading: false })
      }
    )
  };

  submit = () => {
    const { appId } = this.props
    const { email } = this.state
    this.setState({ submitted: true })
    track("app_transfer_requested");
    if (validation(email, "email")) {
      this.setState({ loading: true })
      this.inviteRequest(
        () => {
          this.props.close()
          this.props.fetchApplicationRequest(appId)
          this.props.showResultModal({
            title: "Transfer request sent",
            description:
              "You will be notified by email when new owner accepts transfer request."
          })
        },
        { email }
      )
    }
  };

  handleChangeEmail = ({ target }) => {
    this.setState({ email: target.value })
  };

  render() {
    const { close } = this.props
    const { email, submitted, loading } = this.state

    return (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        onRequestClose={close}
        ariaHideApp={false}
        style={customStylesPopUp}
        contentLabel="Insert price"
      >
        <div
          style={{ padding: "20px 30px" }}
          className="purchase-screen__edit-insert__macros-modal"
        >
          <div className="newapp-header__title">Transfer ownership</div>
          <Input
            label="New owner`s email"
            placeholder="Enter email"
            invalid={!validation(email, "email") && submitted ? 1 : 0}
            onChange={this.handleChangeEmail}
          />
          <div className="input-wrapper">
            <button
              className="button button_blue popup-button fl"
              onClick={close}
            >
              <span>Cancel</span>
            </button>
            <button
              disabled={loading}
              onClick={this.submit}
              className="button button_red popup-button fr"
            >
              Transfer app
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferModal)
