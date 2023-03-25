import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import classNames from "classnames"
import Input from "../../../Common/Input"
import InputRadio from "../../../Common/InputRadio"
import {track, validation} from "../../../../libs/helpers"
import axios from "axios"

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

class TeamInviteModal extends Component {
  state = {
    email: "",
    submitted: false,
    loading: false,
    role: "member",
    show_analytics: true
  };

  inviteRequest = (cb, params) => {
    const { appId } = this.props

    axios.post(`/apps/${appId}/invites`, params).then(
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
    const { email, role, show_analytics } = this.state
    this.setState({ submitted: true })

    if (validation(email, "email")) {
      this.setState({ loading: true })
      this.inviteRequest(
        () => {
          this.props.refreshInvites()
          this.props.close()
          this.props.showResultModal({ title: "Invitation sent!" })
          track("team_user_invited", { email, role, show_analytics });
        },
        { email, role, show_analytics }
      )
    }
  };

  handleChangeEmail = ({ target }) => {
    this.setState({ email: target.value })
  };

  handleChangeRole = ({ target }) => {
    this.setState({
      role: target.value,
      show_analytics:
        target.value === "admin" ? "admin" : this.state.show_analytics
    })
  };

  handleChangeDashboard = (e) => {
    this.setState({ show_analytics: e.target.checked })
  };

  render() {
    const { close } = this.props
    const { email, submitted, role, loading, show_analytics } = this.state

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
          <div className="newapp-header__title">Invite user</div>
          <Input
            label="Email"
            placeholder="Enter email"
            value={email}
            invalid={!validation(email, "email") && submitted ? 1 : 0}
            onChange={this.handleChangeEmail}
          />
          <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_uploader">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 5.5C12 4.97471 11.8965 4.45457 11.6955 3.96927C11.4945 3.48396 11.1999 3.04301 10.8284 2.67157C10.457 2.30014 10.016 2.0055 9.53073 1.80448C9.04543 1.60346 8.52529 1.5 8 1.5C7.47471 1.5 6.95457 1.60346 6.46927 1.80448C5.98396 2.0055 5.54301 2.30014 5.17157 2.67157C4.80014 3.04301 4.5055 3.48396 4.30448 3.96927C4.10346 4.45457 4 4.97471 4 5.5V7.5H3V14.5H13V7.5H6V5.5C6 5.23736 6.05173 4.97728 6.15224 4.73463C6.25275 4.49198 6.40007 4.2715 6.58579 4.08579C6.7715 3.90007 6.99198 3.75275 7.23463 3.65224C7.47728 3.55173 7.73736 3.5 8 3.5C8.26264 3.5 8.52272 3.55173 8.76537 3.65224C9.00802 3.75275 9.2285 3.90007 9.41421 4.08579C9.59993 4.2715 9.74725 4.49198 9.84776 4.73463C9.94827 4.97728 10 5.23736 10 5.5H12ZM8 12.5C8.82843 12.5 9.5 11.8284 9.5 11C9.5 10.1716 8.82843 9.5 8 9.5C7.17157 9.5 6.5 10.1716 6.5 11C6.5 11.8284 7.17157 12.5 8 12.5Z"
                fill="#97ADC6"
              />
            </svg>
            <span>Select role</span>
          </div>
          <InputRadio
            checked={role === "member"}
            label="App member"
            onChange={this.handleChangeRole}
            value="member"
            useTip={true}
            tipOptions={{
              title: "App member",
              description:
                "App members have full access to all Apphud features. But they can’t delete, transfer this app, invite new users and edit user’s roles."
            }}
          />
          <InputRadio
            checked={role === "admin"}
            label="App admin"
            onChange={this.handleChangeRole}
            value="admin"
            useTip={true}
            tipOptions={{
              title: "App admin",
              description:
                "App admin have full access to all Apphud features. But they can’t delete and transfer this app. Only app owner can do this."
            }}
          />
          {role === "member" && (
            <div className="input-wrapper">
              <div className="checkbox-wrapper ms-checkbox">
                <input
                  id="hide"
                  onChange={this.handleChangeDashboard}
                  checked={show_analytics}
                  type="checkbox"
                  className="checkbox"
                />
                <label
                  htmlFor="hide"
                  title="Show dashboard and charts for this user"
                  className="checkbox-label-wrapper"
                >
                  <div className="checkbox-label checkbox-label_small fl">
                    <svg
                      width="11px"
                      className="icon-check"
                      height="8px"
                      viewBox="0 0 11 8"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <defs></defs>{" "}
                      <g
                        id="Symbols"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <g
                          id="ui/check-on"
                          transform="translate(-3.000000, -4.000000)"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        >
                          {" "}
                          <g id="Shape">
                            {" "}
                            <polyline points="13 5 7 11 4 8"></polyline>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>{" "}
                    </svg>
                  </div>
                  <span className="label-text">
                    Show dashboard and charts for this user
                  </span>
                </label>
              </div>
            </div>
          )}
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
              className="button button_green popup-button fr"
            >
              Invite
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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInviteModal)
