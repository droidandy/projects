import React, { Component } from "react"
import { connect } from "react-redux"
import Tooltip from "rc-tooltip"
import Tip from "../../../Common/Tip"
import {track} from "../../../../libs/helpers";

class TeamItem extends Component {
  state = {
    open: false
  };

  overlay = () => {
    const { handleRemoveFromTeam, handleOpenChangeRoleModal, id } = this.props

    return (
      <div className="custom-select__onhover-popup__menu">
        <div
          ref="menu"
          className="custom-select__outer custom-select__outer_relative"
        >
          <div className="custom-select__outer-menu">
            <div
              className="custom-select__outer-menu__item"
              onClick={() => {
                this.closeTooltip()
                handleOpenChangeRoleModal(id)
              }}
            >
              <svg
                className="va-middle integrations-customselect__icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 5C12 4.47471 11.8965 3.95457 11.6955 3.46927C11.4945 2.98396 11.1999 2.54301 10.8284 2.17157C10.457 1.80014 10.016 1.5055 9.53073 1.30448C9.04543 1.10346 8.52529 1 8 1C7.47471 1 6.95457 1.10346 6.46927 1.30448C5.98396 1.5055 5.54301 1.80014 5.17157 2.17157C4.80014 2.54301 4.5055 2.98396 4.30448 3.46927C4.10346 3.95457 4 4.47471 4 5V7H3V14H13V7H6V5C6 4.73736 6.05173 4.47728 6.15224 4.23463C6.25275 3.99198 6.40007 3.7715 6.58579 3.58579C6.7715 3.40007 6.99198 3.25275 7.23463 3.15224C7.47728 3.05173 7.73736 3 8 3C8.26264 3 8.52272 3.05173 8.76537 3.15224C9.00802 3.25275 9.2285 3.40007 9.41421 3.58579C9.59993 3.7715 9.74725 3.99198 9.84776 4.23463C9.94827 4.47728 10 4.73736 10 5H12ZM8 12C8.82843 12 9.5 11.3284 9.5 10.5C9.5 9.67157 8.82843 9 8 9C7.17157 9 6.5 9.67157 6.5 10.5C6.5 11.3284 7.17157 12 8 12Z"
                  fill="#1A344B"
                />
              </svg>
              <span className="custom-select__outer-menu__item-label">
                Change role
              </span>
            </div>
            <div
              className="custom-select__outer-menu__item"
              onClick={() => {
                this.closeTooltip()
                handleRemoveFromTeam(id)
              }}
            >
              <svg
                className="va-middle integrations-customselect__icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#iconx1)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.9498 3.05025C15.6834 5.78392 15.6834 10.2161 12.9498 12.9497C10.2161 15.6834 5.78394 15.6834 3.05027 12.9497C0.316602 10.2161 0.316602 5.78392 3.05027 3.05025C5.78394 0.316582 10.2161 0.316583 12.9498 3.05025ZM8.00002 6.58579L10.1213 4.46447L11.5356 5.87868L9.41423 8L11.5356 10.1213L10.1213 11.5355L8.00002 9.41421L5.8787 11.5355L4.46449 10.1213L6.58581 8L4.46449 5.87868L5.8787 4.46447L8.00002 6.58579Z"
                    fill="#FF0C46"
                  />
                </g>
                <defs>
                  <clipPath id="iconx1">
                    <path d="M0 0H16V16H0V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="custom-select__outer-menu__item-label text-red">
                Remove member
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  };

  overlay2 = () => {
    return (
      <div className="custom-select__onhover-popup__menu">
        <div
          ref="menu"
          className="custom-select__outer custom-select__outer_relative"
        >
          <div className="custom-select__outer-menu">
            <div
              className="custom-select__outer-menu__item"
              onClick={this.handleResend}
            >
              <svg
                className="va-middle integrations-customselect__icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#iconx2)">
                  <path
                    d="M8.00001 12.5C5.51001 12.5 3.50001 10.49 3.50001 8C3.50001 5.51 5.51001 3.5 8.00001 3.5C9.24001 3.5 10.36 4.02 11.17 4.83L9.00001 7H14V2L12.24 3.76C11.15 2.68 9.66001 2 8.00001 2C4.69001 2 2.01001 4.69 2.01001 8C2.01001 11.31 4.69001 14 8.00001 14C10.97 14 13.43 11.84 13.9 9H12.38C11.92 11 10.14 12.5 8.00001 12.5Z"
                    fill="#1A344B"
                  />
                </g>
                <defs>
                  <clipPath id="iconx2">
                    <path d="M0 0H16V16H0V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="custom-select__outer-menu__item-label">
                Resend invitation
              </span>
            </div>
            <div
              className="custom-select__outer-menu__item"
              onClick={this.handleRevoke}
            >
              <svg
                className="va-middle integrations-customselect__icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#iconx1)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.9498 3.05025C15.6834 5.78392 15.6834 10.2161 12.9498 12.9497C10.2161 15.6834 5.78394 15.6834 3.05027 12.9497C0.316602 10.2161 0.316602 5.78392 3.05027 3.05025C5.78394 0.316582 10.2161 0.316583 12.9498 3.05025ZM8.00002 6.58579L10.1213 4.46447L11.5356 5.87868L9.41423 8L11.5356 10.1213L10.1213 11.5355L8.00002 9.41421L5.8787 11.5355L4.46449 10.1213L6.58581 8L4.46449 5.87868L5.8787 4.46447L8.00002 6.58579Z"
                    fill="#FF0C46"
                  />
                </g>
                <defs>
                  <clipPath id="iconx1">
                    <path d="M0 0H16V16H0V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="custom-select__outer-menu__item-label text-red">
                Revoke invitation
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  };

  handleResend = () => {
    this.closeTooltip()
    this.props.resendInvite(this.props.id)
    track("team_invite_resent", {id: this.props.id});
  };

  handleRevoke = () => {
    this.closeTooltip()
    this.props.destroyInvite(this.props.id)
    track("team_invite_revoked", {id: this.props.id});
  };

  onPopupAlign = (domNode) => {
    domNode.style.left = parseInt(domNode.style.left, 10) - 23 + "px"
  };

  closeTooltip = () => {
    this.refs.tooltip.trigger.onMouseLeave()
  };

  render() {
    const {
      invite,
      email,
      avatarUrl,
      role,
      collaborationIsCurrentUser,
      actions,
      isCurrentUser,
      showDashboard
    } = this.props

    return (
      <tr>
        <td width="60%">
          {!invite && (
            <div
              className="team-table__user-avatar"
              style={{ backgroundImage: `url(${avatarUrl})` }}
            />
          )}
          <span className="team-table__user-name">
            {email} {collaborationIsCurrentUser ? "(You)" : ""}
          </span>
        </td>
        <td width="20%">
          <div className="ta-center">
            {showDashboard ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1C4.1339 1 1 4.1339 1 8C1 11.8661 4.1339 15 8 15C11.8661 15 15 11.8661 15 8C15 4.1339 11.8654 1 8 1ZM7.475 12.025L3.975 9.4L5.025 8L7.125 9.575L10.8 4.675L12.2 5.725L7.475 12.025Z"
                  fill="#20BF55"
                />
              </svg>
            ) : (
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
                    d="M12.9498 3.05025C15.6834 5.78392 15.6834 10.2161 12.9498 12.9497C10.2161 15.6834 5.78393 15.6834 3.05026 12.9497C0.316587 10.2161 0.316587 5.78392 3.05026 3.05025C5.78393 0.316582 10.2161 0.316583 12.9498 3.05025ZM8 6.58579L10.1213 4.46447L11.5355 5.87868L9.41422 8L11.5355 10.1213L10.1213 11.5355L8 9.41421L5.87868 11.5355L4.46447 10.1213L6.58579 8L4.46447 5.87868L5.87868 4.46447L8 6.58579Z"
                    fill="#FF0C46"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <path d="M0 0H16V16H0V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}
          </div>
        </td>
        <td width="15%">
          <span className="mr5 capitalize">{role}</span>
          {role === "member" && (
            <Tip
              title="App member"
              description="App members have full access to all Apphud features. But they can’t delete, transfer this app, invite new users and edit user’s roles."
            />
          )}
          {role === "admin" && (
            <Tip
              title="App admin"
              description="App admin have full access to all Apphud features. But they can’t delete and transfer this app. Only app owner can do this."
            />
          )}
        </td>
        <td width="5%">
          {role !== "owner" && actions && !isCurrentUser && (
            <div className="ta-center">
              <Tooltip
                ref="tooltip"
                onPopupAlign={this.onPopupAlign}
                mouseEnterDelay={0.1}
                placement="bottom"
                trigger={["hover"]}
                overlay={invite ? this.overlay2() : this.overlay()}
              >
                <svg
                  className="container-content__integrations-table__menuicon va-middle"
                  ref="customselect"
                  onClick={this.toggleOpen}
                  width="18"
                  height="4"
                  viewBox="0 0 18 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z"
                    fill="#0085FF"
                  />
                  <path
                    d="M9 4C10.1046 4 11 3.10457 11 2C11 0.89543 10.1046 0 9 0C7.89543 0 7 0.89543 7 2C7 3.10457 7.89543 4 9 4Z"
                    fill="#0085FF"
                  />
                  <path
                    d="M16 4C17.1046 4 18 3.10457 18 2C18 0.89543 17.1046 0 16 0C14.8954 0 14 0.89543 14 2C14 3.10457 14.8954 4 16 4Z"
                    fill="#0085FF"
                  />
                </svg>
              </Tooltip>
            </div>
          )}
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application,
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TeamItem)
