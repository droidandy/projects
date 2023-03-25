import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import axios from "axios"
import {track} from "../../../libs/helpers";

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
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class RulesTestModal extends Component {
  state = {
    userId: ""
  };

  handleTrigger = () => {
    const {
      ruleId,
      showResultModal,
      onTestSuccess,
      onTestFail,
      close
    } = this.props
    const { userId } = this.state
    this.setState({ submitted: true, saving: true })
    track("rule_test_popup_triggered");
    if (userId) {
      axios
        .post(`/butler/rules/${ruleId}/test`, { user_id: userId })
        .then(onTestSuccess)
        .catch((_error) => {
          this.setState({ saving: false })
          onTestFail()
        })
    }
  };

  fieldClasses = (name) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && !this.state.userId
    })
  };

  handleChangeUserId = ({ target }) => {
    this.setState({ userId: target.value })
  };

  componentDidMount() {
    track("rule_test_popup_opened");
  }

  render() {
    const { close, appId } = this.props
    const { userId, saving } = this.state
    return (
      <Modal
        isOpen={true}
        onRequestClose={close}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Result modal"
      >
        <div style={{ padding: "20px 30px" }}>
          <div className="newapp-header__title">Test rule</div>
          <div className="mt10">
            To whom trigger this rule?&nbsp;
            <label className="l-p__label l-p__label_inline" htmlFor="UserId">
              <NavLink
                onClick={() => track("rule_test_popup_users_link_clicked")}
                target="_blank"
                className="link link_normal"
                to={`/apps/${appId}/users`}
              >
                View Users
              </NavLink>
            </label>
            <div className="input-wrapper__required">
              <input
                value={userId || ""}
                onChange={this.handleChangeUserId}
                id="UserId"
                placeholder="User ID"
                type="text"
                name="UserId"
                className={this.fieldClasses("apns_auth_key_id")}
              />
              <span className="required-label">Required</span>
            </div>
          </div>
          <div className="input-wrapper oh">
            <button
              className="button button_blue button_160 fl"
              onClick={close}
            >
              <span>Cancel</span>
            </button>
            <button
              disabled={!userId || saving}
              className="button button_160 button_green fr"
              onClick={this.handleTrigger}
            >
              <span>{saving ? "Loading..." : "Trigger now"}</span>
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RulesTestModal)
