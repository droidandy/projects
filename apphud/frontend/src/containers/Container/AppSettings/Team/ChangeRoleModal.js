import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import classNames from "classnames"
import Input from "../../../Common/Input"
import InputRadio from "../../../Common/InputRadio"

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

class ChangeRoleModal extends Component {
  state = {
    email: "",
    submitted: false,
    loading: false,
    role: "member",
    show_analytics: true
  };

  componentDidMount() {
    this.setState(this.props.currentCollaboration)
  }

  submit = () => {
    const { id, role, show_analytics } = this.state
    const params = {
      id,
      role,
      show_analytics
    }
    this.setState({ loading: true })
    this.props.updateCollaboration(() => {
      this.props.close()
      this.props.showResultModal({ title: "Role changed!" })
    }, params)
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
    const { close, currentCollaboration } = this.props
    const { loading, role, show_analytics } = this.state

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
          <div className="newapp-header__title">Change role</div>
          <div className="mt10">
            Select{" "}
            <b>{currentCollaboration ? currentCollaboration.user.email : ""}</b>{" "}
            role:
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
                "App members have full access to all features. They CAN’T delete, transfer this app, invite new users and edit user’s roles."
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
                "App admin have full access to all features. They CAN’T delete and transfer this app. Only app owner can do this."
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
              Save
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeRoleModal)
