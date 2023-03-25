import React, { Component } from 'react';
import SweetAlert from "react-swal"
import { NavLink } from "react-router-dom"
import { fetchIntegrationsRequest } from "../../../../actions/integrations"
import { fetchApphooksRequest } from "../../../../actions/apphooks"
import { connect } from "react-redux"

import webhooksIcon from '../../../../assets/images/webhooks.svg'
import { fetchApplicationRequest } from "../../../../actions/application"
import IntegrationsItem from "../IntegrationsItem"
import Aux from "../../../../hoc/Aux"
import axios from "axios"

class Webhooks extends Component {
  state = {
    application: {},
    webhooks: [],
    loading: false,
    alertOpenWebhook: false
  }

  handleChangeActiveWebhook = (integration, e) => {
    const webhooks = this.state.webhooks.slice(0)
    const findedWebhook = webhooks.find((w) => w.id === integration.id)

    if (findedWebhook) {
      findedWebhook.active = e.target.checked
      axios
        .put(
          `/apps/${this.props.match.params.appId}/app_hooks/${findedWebhook.id}`,
          findedWebhook
        )
        .then((response) => {
          Object.assign(findedWebhook, response.data.data.results)
          this.setState({ webhooks })

          if (response.data.data.results.active) { this.trackActive(response.data.data.results, true) }
        })
    }
  };

  trackActive = (integration, webhook = false) => {
    if (window.analytics) {
      const { user, match } = this.props
      window.segmentHelper.identify(
        user.id,
        {
          integration_enabled: true
        },
        {
          integrations: {
            All: true,
            Webhooks: false
          }
        }
      )

      const params = {
        integration_name: webhook
          ? `webhook - ${integration.name}`
          : integration.id
      }
      if (webhook) params.webhook_id = integration.id

      window.analytics.track("integration_enabled", params)
    }
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.props.fetchApplicationRequest(this.props.match.params.appId, (application) => {
      this.setState(Object.assign(this.state.application, application));
    });

    this.getWebhooks();
  }

  getWebhooks = () => {
    this.setState({ loading: true });
    this.props.fetchApphooksRequest({ appId: this.props.match.params.appId }, (webhooks) => {
      // if (!withoutCurrentTab || webhooks.length === 0) {
      //   if (this.persistedIntegrations(integrations).length > 0) { currentTab = "integrations" } else if (webhooks.length > 0) currentTab = "webhooks"
      // }
      this.setState({
        webhooks,
        loading: false
      });
    })
  }

  removeWebhook = (webhook) => {
    this.setState({
      alertOpenWebhook: true
    })
    this.webhookForRemove = webhook
  };

  handleCallbackAlertWebhook = (value) => {
    this.setState({ alertOpenWebhook: false })

    if (value) {
      axios
        .delete(
          `/apps/${this.props.match.params.appId}/app_hooks/${this.webhookForRemove.id}`
        )
        .then((response) => {
          this.getWebhooks();
        })
    }
  };

  getWebhooksTable = () => {
    return (
      <>
          <SweetAlert
            isOpen={this.state.alertOpenWebhook}
            type="warning"
            title={"Confirm removal"}
            text="Do you really want to remove this webhook? This can not be undone"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            callback={this.handleCallbackAlertWebhook}
          />
        <div className="container-table container-content__integrations-table container-content__integrations-table_nohover mt30">
          <table className="table">
            <thead>
            <tr className="table100-head">
              <th className="column1_integrations">
                <span className="uppercase">Integration</span>
              </th>
              <th className="column2">
                <span className="uppercase">Events</span>
              </th>
              <th className="column4">
                <span className="uppercase">Enabled</span>
              </th>
              <th className="column4">
                <span className="uppercase">Added</span>
              </th>
              <th className="column5 ta-center column5_center column5_th">
                <span className="uppercase">Actions</span>
              </th>
            </tr>
            </thead>
            <tbody>
            {this.state.loading && (
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
                <td>
                  <div className="animated-background timeline-item" />
                </td>
                <td>
                  <div className="animated-background timeline-item" />
                </td>
              </tr>
            )}
            {!this.state.loading &&
            this.state.webhooks.map((webhook) => (
              <IntegrationsItem
                webhook={true}
                remove={this.removeWebhook}
                key={webhook.id}
                appId={this.props.match.params.appId}
                integrationActive={webhook.active}
                integration={webhook}
                handleChangeActive={this.handleChangeActiveWebhook}
              />
            ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  render() {
    const isFreePlan = this.state.application.user && this.state.application.user.subscription.plan.free;

    return (
      <>
        <div className="container-content__blue-header pr15">
          <div className="container-title">
            <span className="va-middle text-black">Server-to-Server webhooks</span>
          </div>
          { !isFreePlan && this.state.webhooks.length > 0 && !this.state.loading && <NavLink
            to={`/apps/${this.props.match.params.appId}/integrations/webhooks/new`}
            className="button button_green l-p__button fr mt0"
          > <span>New webhook</span>
          </NavLink> }
        </div>
        <div className="container-content__blue-content">
          <div className="container-content__notification">
            Send in-app subscription and purchases events to your server. <a className="container-content__learn-more-btn" target="blank" href="https://docs.apphud.com/integrations/webhook">Learn more</a>
          </div>
          {!this.state.loading ? (!this.state.webhooks.length ? <div className="container-content--integrations-no-webhooks">
            <img src={webhooksIcon} alt="webhooksIcon" />
            <div className="container-content--integrations-no-webhooks-right">
              <div className="tag tag-pro">
                PRO
              </div>
              <div className="container-content--integrations-no-webhooks-title">
                Send in-app purchases events to your server
              </div>
              <div className="container-content--integrations-no-webhooks-description">
                Apphud can send server-to-server events. This may be useful if you have in-house analytics hosted on your server or would like to implement custom logics. Webhooks are available on paid plans.
              </div>
              <div className="container-content--integrations-no-webhooks-buttons">
                {isFreePlan ? (
                  <NavLink
                    to={`/profile/billing/change-plan`}
                    className="button button-purple l-p__button fr mt0 container-content--integrations-no-webhooks-button"
                  > <span>New webhook</span>
                  </NavLink> )
                  : (
                  <NavLink
                    to={`/apps/${this.props.match.params.appId}/integrations/webhooks/new`}
                    className="button button_green l-p__button fr mt0 container-content--integrations-no-webhooks-button"
                  > <span>New webhook</span>
                  </NavLink>
                )}
                <NavLink
                  to={`/apps/${this.props.match.params.appId}/integrations/webhooks/new`}
                  className="button button_grey l-p__button fr mt0 container-content--integrations-no-webhooks-button"
                > <span>Learn more</span>
                </NavLink>
              </div>
            </div>
          </div> : this.getWebhooksTable()) : (
            <div className="mt30">
              <div>
                <div className="animated-background timeline-item" />
              </div>
              <div>
                <div className="animated-background timeline-item mt20" />
              </div>
              <div>
                <div className="animated-background timeline-item mt20" />
              </div>
              <div>
                <div className="animated-background timeline-item mt20" />
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchApplicationRequest,
  fetchIntegrationsRequest,
  fetchApphooksRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Webhooks);
