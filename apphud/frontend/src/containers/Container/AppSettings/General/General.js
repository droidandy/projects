import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import history from "../../../../history";
import {
  updateApplicationRequest,
  fetchApplicationRequest,
  removeApplicationRequest
} from "../../../../actions/application";
import { fetchApplicationsRequest } from "../../../../actions/applications";
import SweetAlert from "react-swal";
import { NotificationManager } from "../../../../libs/Notifications";
import {track, validation} from "../../../../libs/helpers";
import ResultModal from "../../../Common/ResultModal";
import TransferModal from "./TransferModal";
import Input from "../../../../components/Input";
import InputSelect from "../../../Common/InputSelect";

const moment = require("moment-timezone");

class General extends Component {
  state = {
    copied: false,
    alertOpen: false,
    name: "",
    api_key: "",
    time_zone: null,
    timezones: [],
    resultModal: {
      title: "",
      description: "",
      show: false
    },
    transferModal: false,
    leaveAlert: false,
    revoke: false
  };

  getApp = (props = this.props) => {
    const state = this.state;
    if (
      props.application.id &&
      props.match.params.appId === props.application.id
    ) {
      this.setState(Object.assign(state, props.application));
    } else {
      props.fetchApplicationRequest(props.match.params.appId, (application) => {
        this.setState(Object.assign(state, application));
      });
    }
  };

  componentDidMount() {
    this.getApp();
    this.getTimezones();
    document.title = "Apphud | General settings";
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.appId !== nextProps.match.params.appId) {
      this.getApp(nextProps);
    }
  }

  getTimezones = async() => {
    try {
      const {application} = this.props;
      const response = await axios.get("apps/time_zones");
      const data = response?.data?.data;
      const items = (data?.results || []).map((o) => ({ label: o.name, value: o.value }));
      const currentItem = items.find(v => v.value === application?.time_zone);
      this.handleChangeValue("time_zone", currentItem || items[0]);
      this.handleChangeValue("timezones", items);
    } catch (e) {}
  }

  handleSubmit = (e) => {
    const { name } = this.state;

    e.preventDefault();
    this.setState({ updateSubmitted: true });
    if (name && validation(name, "name")) {
      const params = Object.assign({}, {...this.state, time_zone: this.state.time_zone?.value});
      this.props.updateApplicationRequest(params, (app) => {
        this.setState({ updateSubmitted: false });
        this.props.fetchApplicationRequest(
          this.props.match.params.appId,
          (application) => { }
        );
        this.props.fetchApplicationsRequest();
        track("app_saved", params);
        NotificationManager.success("App successfully saved", "OK", 5000);
      });
    }
  };

  getErrors = (field) => {
    const invalid = this.state.updateSubmitted && !validation(this.state[field], "name");
    return invalid ? [field] : [];
  };

  handleChangeValue = (field, value) => {
    this.setState({ [field]: value });
  };

  handleRemoveApp = () => {
    this.showResultModal({
      title: "Information",
      description:
        "Please contact us in any way in order to completely delete the app. Thank you!"
    });
    track("app_left");
  };

  handleCallbackAlert = (value) => {
    this.setState({ alertOpen: false });

    if (value) {
      this.props.removeApplicationRequest(this.props.application, () => {
        this.props.fetchApplicationsRequest((applications) => {
          if (applications.length > 0) {
            history.push(`/apps/${applications[0].id}/users`);
          } else history.push("/newapp");
        });
      });
    }
  };

  showResultModal = ({ title, description }) => {
    this.setState({ resultModal: { title, description, show: true } });
  };

  closeResultModal = () => {
    this.setState({ resultModal: { title: "", description: "", show: false } });
  };

  closeTransferModal = () => {
    this.setState({ transferModal: false });
  };

  showTransferModal = () => {
    this.setState({ transferModal: true });
  };

  handleOpenLeaveAppAlert = () => {
    track("app_left");
    this.setState({ leaveAlert: true });
  };

  handleLeaveApp = () => {
    const { appId } = this.props.match.params;
    const collaborationId = this.props.application.user_collaboration.id;

    axios
      .delete(`/apps/${appId}/collaborations/${collaborationId}`)
      .then((response) => {
        this.props.fetchApplicationsRequest((applications) => {
          if (applications.length > 0) {
            history.push(`/apps/${applications[0].id}/users`);
          } else history.push("/newapp");
        });
      });
  };

  handleCallbackLeaveAlert = (ok) => {
    if (ok) this.handleLeaveApp();

    this.setState({ leaveAlert: false });
  };

  handleOpenRevoke = () => {
    this.setState({ revoke: true });
  };

  handleCallbackRevokeAlert = (ok) => {
    if (ok) this.revokeGrantRequest();

    this.setState({ revoke: false });
  };

  revokeGrantRequest = () => {
    const { appId } = this.props.match.params;

    axios
      .delete(
        `/apps/${appId}/invites/${this.props.application.grant_request.id}`
      )
      .then((response) => {
        this.showResultModal({ title: "Transfer revoked!" });
        this.props.fetchApplicationRequest(appId);
      });
  };

  render() {
    const { subscription, application } = this.props;
    const { status } = subscription;
    const { user_collaboration, grant_request } = application;
    const {
      name,
      api_key,
      time_zone,
      timezones,
      resultModal,
      transferModal,
      leaveAlert,
      revoke
    } = this.state;
    const { appId } = this.props.match.params;

    const isGracePeriod = status === "grace";
    const isPastDuePeriod = status === "past_due";

    const hideTransferOwnershipLink = isGracePeriod || isPastDuePeriod;
    return (
      <>
        <div className="container-content__blue-header pr15">
          <div className="container-title">
            <span className="va-middle text-black">General settings</span>
          </div>
          <button
            onClick={this.handleSubmit}
            className="button button_green l-p__button fr mt0"
          >
            <span>Save</span>
          </button>
        </div>
        <div className="container-content__blue-content">
          {/* <SweetAlert
            isOpen={alertOpen}
            type="warning"
            title={"Confirm removal"}
            text="Do you really want to remove app? This can not be undone"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            callback={this.handleCallbackAlert} /> */}
          <SweetAlert
            isOpen={leaveAlert}
            type="warning"
            title="Leave this app?"
            html={true}
            text="To join this app again you will have to ask admin or owner to send new invitation."
            confirmButtonText="Leave this app"
            cancelButtonText="Cancel"
            callback={this.handleCallbackLeaveAlert}
          />
          <SweetAlert
            isOpen={revoke}
            type="warning"
            title="Revoke transfer request?"
            html={true}
            text="Do you want to revoke app transfer request?"
            confirmButtonText="Revoke request"
            cancelButtonText="Cancel"
            callback={this.handleCallbackRevokeAlert}
          />
          {resultModal.show && (
            <ResultModal
              title={resultModal.title}
              description={resultModal.description}
              close={this.closeResultModal}
              onConfirm={this.closeResultModal}
            />
          )}
          <form
            className="appsettings-container__form"
          >
            <Input
              label='App name'
              value={name || ""}
              onChange={({ value }) => this.handleChangeValue("name", value)}
              type='text'
              id='name'
              name="name"
              required={true}
              errors={this.getErrors("name")}
              placeholder="App name"
            />
            <Input
              label='API KEY'
              value={api_key}
              type={"text"}
              id='api_key'
              name="api_key"
              readOnly={true}
              copyButton={true}
              bottomText={"Use this key to setup SDKs."}
            />
            <div className="input-wrapper ta-left">
              <label className="l-p__label d-inline-block">Project timezone</label>
              <div className="input-wrapper__required">
                <InputSelect
                  name="timezone"
                  value={time_zone}
                  onChange={v => {
                    track("timezone_changed", { old_tz: time_zone, new_tz: v });
                    this.handleChangeValue("time_zone", v);
                  }}
                  isSearchable={true}
                  autoFocus={false}
                  clearable={false}
                  classNamePrefix="input-select"
                  className="input-select input-select_blue"
                  maxMenuHeight={257}
                  placeholder="Select timezone"
                  options={timezones}
                />
              </div>
            </div>
          </form>
          <div className="mt30">
            {user_collaboration.role === "owner" && !grant_request && !hideTransferOwnershipLink && (
              <div className="mt10">
                <span className="cp text-blue" onClick={this.showTransferModal}>
                  Transfer ownership
                </span>
              </div>
            )}
            {grant_request && (
              <div>
                Transfer request sent to <b>{grant_request.email}</b>.&nbsp;
                <span
                  className="cp link link_normal"
                  onClick={this.handleOpenRevoke}
                >
                  Revoke request
                </span>
              </div>
            )}
            {user_collaboration.role !== "owner" && (
              <div className="mt10">
                <span
                  className="cp text-red"
                  onClick={this.handleOpenLeaveAppAlert}
                >
                  Leave this app
                </span>
              </div>
            )}
            {user_collaboration.role === "owner" && (
              <div className="mt10">
                <span className="cp text-red" onClick={this.handleRemoveApp}>
                  Delete app
                </span>
              </div>
            )}
          </div>
          {transferModal && (
            <TransferModal
              appId={appId}
              close={this.closeTransferModal}
              showResultModal={this.showResultModal}
            />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application,
    applications: state.applications,
    subscription: state.user.subscription
  };
};

const mapDispatchToProps = {
  updateApplicationRequest,
  fetchApplicationRequest,
  fetchApplicationsRequest,
  removeApplicationRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(General);
