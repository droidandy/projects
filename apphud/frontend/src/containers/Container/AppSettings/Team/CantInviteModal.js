import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import Modal from "react-modal"
import {track} from "../../../../libs/helpers";

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

class CantInviteModal extends Component {
  render() {
    const { close } = this.props

    return (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        onRequestClose={close}
        ariaHideApp={false}
        style={customStylesPopUp}
        contentLabel="Can’t invite new user"
      >
        <div
          style={{ padding: "20px 30px" }}
          className="purchase-screen__edit-insert__macros-modal"
        >
          <div className="newapp-header__title">Can’t invite new user</div>
          <div className="mt10">
            You can add only 1 collaborator in Free plan. Upgrade plan to add
            more collaborators.
          </div>
          <div className="input-wrapper">
            <button
              className="button button_blue popup-button fl"
              onClick={close}
            >
              <span>Cancel</span>
            </button>
            <NavLink
              to={"/profile/billing/change-plan"}
              className="button button_green popup-button fr"
              onClick={() => track("team_invite_upgrade_popup_submitted")}
            >
              Upgrade plan
            </NavLink>
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

export default connect(mapStateToProps, mapDispatchToProps)(CantInviteModal)
