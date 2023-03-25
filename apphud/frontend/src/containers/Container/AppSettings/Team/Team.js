import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../../history"
import Tip from "../../../Common/Tip"
import ResultModal from "../../../Common/ResultModal"
import axios from "axios"
import { NotificationManager } from "../../../../libs/Notifications"
import TeamItem from "./TeamItem"
import TeamInviteModal from "./TeamInviteModal"
import ChangeRoleModal from "./ChangeRoleModal"
import SweetAlert from "react-swal"
import { fetchApplicationRequest } from "../../../../actions/application"
import CantInviteModal from "./CantInviteModal"
import {track} from "../../../../libs/helpers";

class Team extends Component {
  state = {
    resultModal: {
      title: "",
      description: "",
      show: false
    },
    changeRoleModal: false,
    removeUserFromTeamModal: false,
    collaborations: [],
    invites: [],
    inviteModal: false,
    loadingCollaborations: true,
    loadingInvites: true,
    collaborationToRemove: {},
    cantInviteModal: false
  };

  getCollaborations = (cb) => {
    const { appId } = this.props.match.params

    axios.get(`/apps/${appId}/collaborations`).then((response) => {
      cb(response.data.data.results)
    })
  };

  updateCollaboration = (cb, params) => {
    const { appId } = this.props.match.params

    axios
      .put(`/apps/${appId}/collaborations/${params.id}`, params)
      .then((response) => {
        const { collaborations } = this.state
        const collaboration = collaborations.find((c) => c.id === params.id)
        Object.assign(collaboration, params)
        this.setState({ collaborations })
        this.props.fetchApplicationRequest(appId)
        cb(response.data.data.results)
      })
  };

  destroyCollaboration = (id, cb) => {
    const { appId } = this.props.match.params

    axios.delete(`/apps/${appId}/collaborations/${id}`).then((response) => {
      const { collaborations } = this.state
      const collaboration = collaborations.find((c) => c.id === id)
      const index = collaborations.indexOf(collaboration)

      if (index > -1) {
        collaborations.splice(index, 1)
        this.setState({ collaborations })
      }
    })
  };

  getInvites = (cb = () => {}) => {
    const { appId } = this.props.match.params

    axios.get(`/apps/${appId}/invites`).then((response) => {
      cb(response.data.data.results)
    })
  };

  refreshInvites = () => {
    this.setState({ loadingInvites: true })
    this.getInvites((invites) => {
      this.setState({ loadingInvites: false, invites })
    })
  };

  resendInvite = (id) => {
    const { appId } = this.props.match.params

    axios.post(`/apps/${appId}/invites/${id}/resend`).then((response) => {
      this.showResultModal({ title: "Invitation sent!" })
    })
  };

  destroyInvite = (id) => {
    const { appId } = this.props.match.params

    axios.delete(`/apps/${appId}/invites/${id}`).then((response) => {
      this.showResultModal({ title: "Invitation revoked!" })
      this.refreshInvites()
    })
  };

  componentWillMount() {
    this.refreshInvites()
    document.title = "Apphud | Team"
    this.getCollaborations((collaborations) => {
      this.setState({ loadingCollaborations: false, collaborations })
    })
  }

  showResultModal = ({ title, description }) => {
    this.setState({ resultModal: { title, description, show: true } })
  };

  closeResultModal = () => {
    this.setState({ resultModal: { title: "", description: "", show: false } })
  };

  handleCloseInviteModal = () => {
    this.setState({ inviteModal: false })
  };

  handleOpenInviteModal = () => {
    const { plan } = this.props.user.subscription
    const { collaborations, invites } = this.state
    track("team_invite_button_clicked")
    if (!plan.free || (collaborations.length === 1 && invites.length === 0)) { this.setState({ inviteModal: true }) } else this.showCantInviteModal()
  };

  handleCloseChangeRoleModal = () => {
    this.setState({ changeRoleModal: false })
  };

  handleOpenChangeRoleModal = (id) => {
    this.setState({
      changeRoleModal: true,
      currentCollaboration: this.state.collaborations.find((c) => c.id === id)
    })
  };

  handleRemoveFromTeam = (id) => {
    const { collaborations } = this.state
    const collaboration = collaborations.find((c) => c.id === id)

    this.setState({
      collaborationToRemove: { id, email: collaboration.user.email },
      removeUserFromTeamModal: true
    })
  };

  handleCallbackRemoveAlert = (ok) => {
    if (ok) this.destroyCollaboration(this.state.collaborationToRemove.id)

    this.setState({ removeUserFromTeamModal: false })
  };

  showCantInviteModal = () => {
    this.setState({ cantInviteModal: true });
    track("team_invite_upgrade_popup_shown");
  };

  closeCantInviteModal = () => {
    this.setState({ cantInviteModal: false })
  };

  render() {
    const { component, application, match } = this.props
    const { user_collaboration } = application
    const {
      resultModal,
      inviteModal,
      removeUserFromTeamModal,
      changeRoleModal,
      collaborations,
      invites,
      loadingCollaborations,
      loadingInvites,
      currentCollaboration,
      collaborationToRemove,
      cantInviteModal
    } = this.state
    const { appId } = match.params
    return (
      <div className={component ? "" : "container-content__blue-content"}>
        <div className="container-title">
          <span className="va-middle text-black">Team</span>
        </div>
        {!component && (<>
            {["owner", "admin"].indexOf(user_collaboration.role) > -1 && (
              <button
                onClick={this.handleOpenInviteModal}
                className={`button l-p__button fr mt0 ${
                  component ? "button_blue" : "button_green"
                } button_160`}
              >
                Invite user
              </button>
            )}
          </>
        )}
        <div className="container-content__appsettings">
          <table className="table team-table">
            <thead>
              <tr className="table100-head">
                <th width="60%">USER</th>
                <th width="20%">
                  <div className="ta-center">SHOW DASHBOARD</div>
                </th>
                <th width="15%">ROLE</th>
                <th width="5%">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loadingCollaborations && (
                <tr>
                  <td>
                    <div
                      className="animated-background timeline-item"
                      style={{ height: 30 }}
                    />
                  </td>
                  <td>
                    <div
                      className="animated-background timeline-item"
                      style={{ height: 30 }}
                    />
                  </td>
                  <td>
                    <div
                      className="animated-background timeline-item"
                      style={{ height: 30 }}
                    />
                  </td>
                  <td>
                    <div
                      className="animated-background timeline-item"
                      style={{ height: 30 }}
                    />
                  </td>
                </tr>
              )}
              {!loadingCollaborations &&
                collaborations.map(
                  ({ id, user, role, created_at, show_analytics }) => (
                    <TeamItem
                      id={id}
                      key={id}
                      role={role}
                      created_at={created_at}
                      avatarUrl={user.avatar_url}
                      email={user.email}
                      showDashboard={show_analytics}
                      isCurrentUser={user.id === this.props.user.id}
                      collaborationIsCurrentUser={
                        user.id === this.props.user.id
                      }
                      actions={
                        ["admin", "owner"].indexOf(user_collaboration.role) > -1
                      }
                      handleRemoveFromTeam={this.handleRemoveFromTeam}
                      handleOpenChangeRoleModal={this.handleOpenChangeRoleModal}
                    />
                  )
                )}
            </tbody>
          </table>
        </div>
        {invites.length > 0 && (
          <div>
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
                  d="M11 2.5H12V4.5H14V5.5H12V7.5H11V5.5H9V4.5H11V2.5ZM5 10C6.65685 10 8 8.65685 8 7C8 5.34315 6.65685 4 5 4C3.34315 4 2 5.34315 2 7C2 8.65685 3.34315 10 5 10ZM8.53553 11.9645C9.47322 12.9021 10 14.1739 10 15.5H5L0 15.5C0 14.1739 0.526784 12.9021 1.46447 11.9645C2.40215 11.0268 3.67392 10.5 5 10.5C6.32608 10.5 7.59785 11.0268 8.53553 11.9645Z"
                  fill="#97ADC6"
                />
              </svg>
              <span>Invitations</span>
            </div>
            <div className="container-content__appsettings">
              <table className="table team-table">
                <thead>
                  <tr className="table100-head">
                    <th width="60%">USER</th>
                    <th width="20%">
                      <div className="ta-center">SHOW DASHBOARD</div>
                    </th>
                    <th width="15%">ROLE</th>
                    <th width="5%">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingInvites && (
                    <tr>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                    </tr>
                  )}
                  {!loadingInvites &&
                    invites.map(
                      ({ id, role, email, created_at, show_analytics }) => (
                        <TeamItem
                          id={id}
                          key={id}
                          role={role}
                          invite={true}
                          created_at={created_at}
                          email={email}
                          showDashboard={show_analytics}
                          resendInvite={this.resendInvite}
                          destroyInvite={this.destroyInvite}
                          actions={
                            ["admin", "owner"].indexOf(
                              user_collaboration.role
                            ) > -1
                          }
                          handleRemoveFromTeam={this.handleRemoveFromTeam}
                          handleOpenChangeRoleModal={
                            this.handleOpenChangeRoleModal
                          }
                        />
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {component && (<>
          {["owner", "admin"].indexOf(user_collaboration.role) > -1 && (
            <button
              onClick={this.handleOpenInviteModal}
              className={`button l-p__button fr mt30 ${
                component ? "button_blue" : "button_green"
              } button_160`}
            >
              Invite user
            </button>
          )}
        </>
        )}
        <SweetAlert
          isOpen={removeUserFromTeamModal}
          type="warning"
          title="Remove user from team?"
          html={true}
          text={`User <b>${collaborationToRemove.email}</b> will not have longer access to this app. Remove user from team?`}
          confirmButtonText="Remove"
          cancelButtonText="Cancel"
          callback={this.handleCallbackRemoveAlert}
        />
        {cantInviteModal && (
          <CantInviteModal close={this.closeCantInviteModal} />
        )}
        {inviteModal && (
          <TeamInviteModal
            showResultModal={this.showResultModal}
            refreshInvites={this.refreshInvites}
            close={this.handleCloseInviteModal}
            appId={appId}
          />
        )}
        {changeRoleModal && (
          <ChangeRoleModal
            showResultModal={this.showResultModal}
            currentCollaboration={currentCollaboration}
            updateCollaboration={this.updateCollaboration}
            close={this.handleCloseChangeRoleModal}
          />
        )}
        {resultModal.show && (
          <ResultModal
            buttonColor="green"
            title={resultModal.title}
            description={resultModal.description}
            close={this.closeResultModal}
            onConfirm={this.closeResultModal}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application,
    user: state.sessions
  }
}

const mapDispatchToProps = {
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Team)
