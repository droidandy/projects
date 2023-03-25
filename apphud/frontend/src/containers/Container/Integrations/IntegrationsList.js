import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink, Route } from "react-router-dom"
import history from "../../../history"
import Aux from "../../../hoc/Aux"
import IntegrationsItem from "./IntegrationsItem"
import SweetAlert from "react-swal"
import { fetchIntegrationsRequest } from "../../../actions/integrations"
import { fetchApphooksRequest } from "../../../actions/apphooks"
import axios from "axios"
import uniqBy from "lodash/uniqBy"
import Modal from "react-modal"
import applesearchadsIcon from "../../../assets/images/applesearchads.svg"
import titleize from "titleize"
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

const APPLE_SEARCH_ADS_INTEGRATION = {
  category: "attribution",
  title: "Apple Search Ads",
  description: "Promote your app on the App Store",
  icon: applesearchadsIcon,
  url: "https://docs.apphud.com/integrations/attribution/apple-search-ads",
  static: true,
  available_on_free_plan: true
}

class IntegrationsList extends Component {
  state = {
    alertOpen: false,
    alertOpenWebhook: false,
    restrictionPopup: false,
    loading: true,
    webhooks: [],
    integrations: [],
    integrationsCategories: [],
    appStoreIdPopup: false,
    currentTab: "integrations",
    appleSearchAds: false
  };

  showAppleSearchAdsInfo = () => {
    this.setState({ appleSearchAds: true })
  };

  closeAppleSearchAdsInfo = () => {
    this.setState({ appleSearchAds: false })
  };

  getIntegrations = (withoutCurrentTab = false) => {
    let { currentTab } = this.state
    const {
      fetchIntegrationsRequest,
      fetchApphooksRequest,
      match,
      user,
      platform
    } = this.props
    const { appId } = match.params

    fetchIntegrationsRequest({ appId, platform }, (integrations) => {
      integrations.push(APPLE_SEARCH_ADS_INTEGRATION)
      let integrationsCategories = integrations.map((integration) => ({
        categoryName: integration.category
      }))
      integrationsCategories = uniqBy(integrationsCategories, "categoryName")

      this.setState({
        integrations,
        integrationsCategories,
        loading: false
      });
    })
  };

  componentDidMount() {
    this.getIntegrations()
    document.title = "Apphud | Integrations"
  }

  getIntegrationsByCategory = (category) => {
    const { integrations } = this.state
    return integrations.filter((i) => i.category === category)
  };

  // handleChangeActiveWebhook = (integration, e) => {
  //   const webhooks = this.state.webhooks.slice(0)
  //   const findedWebhook = webhooks.find((w) => w.id === integration.id)
  //
  //   if (findedWebhook) {
  //     findedWebhook.active = e.target.checked
  //     axios
  //       .put(
  //         `/apps/${this.props.match.params.appId}/app_hooks/${findedWebhook.id}`,
  //         findedWebhook
  //       )
  //       .then((response) => {
  //         Object.assign(findedWebhook, response.data.data.results)
  //         this.setState({ webhooks })
  //
  //         if (response.data.data.results.active) { this.trackActive(response.data.data.results, true) }
  //       })
  //   }
  // };

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

  handleChangeActive = (integration, e) => {
    const integrations = this.state.integrations.slice(0)
    const findedIntegration = integrations.find(
      (integrationItem) => integrationItem.id === integration.id
    )

    if (findedIntegration) {
      if (
        findedIntegration.id === "appsflyer-ios" &&
        e.target.checked &&
        !this.props.application.appstore_app_id
      ) { this.handleShowAppStoreIdPopup() } else {
        findedIntegration.active = e.target.checked
        this.updateIntegration(findedIntegration, (response) => {
          this.setState({ integrations: integrations })

          if (findedIntegration.active) {
            this.trackActive(findedIntegration)
          }else{
            track("integration_disabled", findedIntegration);
          }
        })
      }
    }
  };

  updateIntegration = (integration, cb = () => {}) => {
    axios
      .put(
        `/apps/${this.props.match.params.appId}/integrations/${integration.id}`,
        integration
      )
      .then(cb)
  };

  persistedIntegrations = (integrations = this.state.integrations.slice(0)) => {
    return integrations.filter((integration) => {
      return integration.persisted
    })
  };

  remove = (integration) => {
    this.setState({
      alertOpen: true
    })
    this.integrationForRemove = integration
    track("integration_removed", integration);
  };

  handleCallbackAlert = (value) => {
    this.setState({ alertOpen: false })

    if (value) {
      axios
        .delete(
          `/apps/${this.props.match.params.appId}/integrations/${this.integrationForRemove.id}`
        )
        .then((response) => {
          this.getIntegrations()
        })
    }
  };

  // removeWebhook = (webhook) => {
  //   this.setState({
  //     alertOpenWebhook: true
  //   })
  //   this.webhookForRemove = webhook
  // };

  handleCallbackAlertWebhook = (value) => {
    this.setState({ alertOpenWebhook: false })

    if (value) {
      axios
        .delete(
          `/apps/${this.props.match.params.appId}/app_hooks/${this.webhookForRemove.id}`
        )
        .then((response) => {
          this.getIntegrations(true)
        })
    }
  };

  handleCheckPlan = (e) => {
    const { user } = this.props

    if (user.subscription && user.subscription.plan.free) {
      this.handleShowRestrictionPopup()
      e.preventDefault()
    }
  };

  handleCloseAppStoreIdPopup = () => {
    this.setState({ appStoreIdPopup: false })
  };

  handleShowAppStoreIdPopup = () => {
    this.setState({ appStoreIdPopup: true })
  };

  handleShowRestrictionPopup = () => {
    this.setState({ restrictionPopup: true })
  };

  handleCloseRestrictionPopup = () => {
    this.setState({ restrictionPopup: false })
  };

  handleChangeTab = (currentTab) => {
    this.setState({ currentTab })
  };

  tabClasses = (tab) => {
    const { currentTab } = this.state

    return classNames("container-header-menu__item cp", {
      "container-header-menu__item_active": tab === currentTab
    })
  };

  render() {
    const {
      loading,
      integrations,
      integrationsCategories,
      webhooks,
      currentTab,
      restrictionPopup,
      alertOpen,
      alertOpenWebhook,
      appleSearchAds
    } = this.state
    const { user } = this.props

    return (
      <>
        <div className="container-content__blue-header pr15">
          <div className="container-title">
            <span className="va-middle text-black">Integrations</span>
          </div>
        </div>
        <div className="container-content__blue-content">
          <div className="container-content__notification">
            Send in-app subscription and purchase events to third-party integrations.
            <a
                onClick={() => track("integration_learn_more_link_clicked", {link_url:"https://docs.apphud.com/integrations"})}
                className="container-content__learn-more-btn"
                target="blank"
                href="https://docs.apphud.com/integrations">Learn more</a>
          </div>
        </div>
      <div className="container-content__wrapper">
          <div className="container-content container-content__white container-content__integrations">
          <SweetAlert
            isOpen={alertOpen}
            type="warning"
            title={"Confirm removal"}
            text="Do you really want to remove this integration? This can not be undone"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            callback={this.handleCallbackAlert}
          />
          <SweetAlert
            isOpen={alertOpenWebhook}
            type="warning"
            title={"Confirm removal"}
            text="Do you really want to remove this webhook? This can not be undone"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            callback={this.handleCallbackAlertWebhook}
          />
          <Modal
            isOpen={this.state.appStoreIdPopup}
            onRequestClose={this.handleCloseAppStoreIdPopup}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Enter App Store app ID"
          >
            <div style={{ padding: "20px 30px" }}>
              <div className="newapp-header__title">Enter App Store app ID</div>
              <div className="input-wrapper">
                Please, enter your app’s App Store ID to enable this integration
              </div>
              <div className="input-wrapper">
                <button
                  className="button button_blue popup-button fl"
                  onClick={this.handleCloseAppStoreIdPopup}
                >
                  <span>Cancel</span>
                </button>
                <NavLink
                  target="_blank"
                  to={`/apps/${this.props.match.params.appId}/settings/general`}
                  className="button button_green popup-button fr"
                >
                  <span>Open App Settings</span>
                </NavLink>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={restrictionPopup}
            onRequestClose={this.handleCloseRestrictionPopup}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Enter App Store app ID"
          >
            <div style={{ padding: "20px 30px" }}>
              <div className="newapp-header__title">Premium integration</div>
              <div className="input-wrapper">
                This integration is available on paid plans only. Please upgrade
                your plan in order to use it.
              </div>
              <div className="input-wrapper">
                <button
                  className="button button_blue popup-button fl"
                  onClick={this.handleCloseRestrictionPopup}
                >
                  <span>Cancel</span>
                </button>
                <NavLink
                  to={"/profile/billing/change-plan"}
                  className="button button_green popup-button fr"
                >
                  <span>Upgrade plan</span>
                </NavLink>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={appleSearchAds}
            onRequestClose={this.closeAppleSearchAdsInfo}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Result modal"
          >
            <div style={{ padding: "20px 30px" }}>
              <div className="newapp-header__title">Apple Search Ads</div>
              <div className="mt10">
                View docs to find how to integrate Apple Search Ads.
              </div>
              <div className="input-wrapper oh">
                <button
                  className="button button_blue button_160 fl"
                  onClick={this.closeAppleSearchAdsInfo}
                >
                  <span>Cancel</span>
                </button>
                <a
                  href="https://docs.apphud.com/integrations/attribution/apple-search-ads"
                  target="_blank"
                  className="button button_green button_160 fr"
                >
                  <span>View docs</span>
                </a>
              </div>
            </div>
          </Modal>
          <div>
            {currentTab === "integrations" &&
              this.persistedIntegrations(integrations).length > 0 && (
              <Aux>
                <div className="container-table container-content__integrations-table container-content__integrations-table_nohover">
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
                      {loading && (
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
                      {!loading &&
                          this.persistedIntegrations(
                            integrations
                          ).map((integration) => (
                            <IntegrationsItem
                              handleCheckPlan={this.handleCheckPlan}
                              remove={this.remove}
                              key={integration.id}
                              platform={integration.platform}
                              appId={this.props.match.params.appId}
                              integrationActive={integration.active}
                              integration={integration}
                              handleChangeActive={this.handleChangeActive}
                            />
                          ))}
                    </tbody>
                  </table>
                </div>
              </Aux>
            )}
          </div>
          {/* <div className="integrations-request__block">
            <div className="integrations-request__block-left">
              <div className="integrations-request__block-left__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM6 10C6 8.89543 6.89543 8 8 8H10V6H11V8H13V6H14V8H16C17.1046 8 18 8.89543 18 10H6ZM18 11C18 12.5913 17.3679 14.1174 16.2426 15.2427C15.2359 16.2494 13.9082 16.8615 12.5 16.9792V19H11.5V16.9792C10.0918 16.8615 8.76412 16.2494 7.75736 15.2427C6.63214 14.1174 6 12.5913 6 11H12H18Z" fill="#4284FB"/>
                </svg>
              </div>
              <div className="ta-left integrations-request__block-left__input">
                <label className="l-p__label bold" htmlFor="name">Request integration</label>
                <input
                  value=""
                  onChange={() => {}}
                  id="name"
                  placeholder="Enter integration you are interested in and we will integrate it! 🤓"
                  type="name"
                  name="name"
                  required=""
                  className={"input input_blue input_stretch"} />
              </div>
            </div>
            <div className="integrations-request__block-right">
              <button className="button button_blue integrations-request__block-right__button button_34">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 0C3.1339 0 0 3.1339 0 7C0 10.8661 3.1339 14 7 14C10.8661 14 14 10.8661 14 7C14 3.1339 10.8654 0 7 0ZM6.475 11.025L2.975 8.4L4.025 7L6.125 8.575L9.8 3.675L11.2 4.725L6.475 11.025Z" fill="white"/>
                </svg>
                <span>Submit</span>
              </button>
            </div>
          </div> */}
          {loading && (
            <div>
              <div className="animated-background timeline-item" />
              <div className="animated-background timeline-item__row" />
              <div className="animated-background timeline-item__row" />
              <div className="animated-background timeline-item__row" />
              <p>&nbsp;</p>
            </div>
          )}
          {/*{!loading && (*/}
          {/*  <div className="integrations-request__block">*/}
          {/*    <div className="integrations-request__block-right fr">*/}
          {/*      <NavLink*/}
          {/*        onClick={this.handleCheckPlan}*/}
          {/*        to={`/apps/${this.props.match.params.appId}/integrations/webhooks/new`}*/}
          {/*        className="button button_green integrations-request__block-right__button"*/}
          {/*      >*/}
          {/*        <svg*/}
          {/*          width="16"*/}
          {/*          height="16"*/}
          {/*          viewBox="0 0 16 16"*/}
          {/*          fill="none"*/}
          {/*          xmlns="http://www.w3.org/2000/svg"*/}
          {/*        >*/}
          {/*          <path*/}
          {/*            fillRule="evenodd"*/}
          {/*            clipRule="evenodd"*/}
          {/*            d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 7H12V9H9V12H7V9H4V7H7V4H9V7Z"*/}
          {/*            fill="white"*/}
          {/*          />*/}
          {/*        </svg>*/}
          {/*        <span>Add integration</span>*/}
          {/*      </NavLink>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}
          {!loading &&
            integrationsCategories.map((category, index) => (
              <div key={index}>
                <div className="integrations-request__block-title">
                  {titleize(category.categoryName).replace(/_/g, " ")}
                </div>
                {this.getIntegrationsByCategory(category.categoryName).map(
                  (integration, index) => (
                    <div className="integrations-request__block" key={index}>
                      <div className="integrations-request__block-left">
                        <div className="integrations-request__block-left__icon">
                          <img src={integration.icon} alt="service icon" />
                        </div>
                        <div className="ta-left integrations-request__block-left__input">
                          <label className="l-p__label bold" htmlFor="name">
                            {integration.title}
                          </label>
                          <div className="integrations-request__block-left__input-text">
                            {integration.description}
                          </div>
                        </div>
                      </div>
                      {integration.static ? (
                        <div className="integrations-request__block-right fr">
                          <div
                            onClick={this.showAppleSearchAdsInfo}
                            className="button button_blue integrations-request__block-right__button cp"
                          >
                            <span>How to add integration?</span>
                          </div>
                        </div>
                      ) : (
                        <div className="integrations-request__block-right fr">
                          {integration.persisted && (
                            <NavLink
                              onClick={
                                integration.available_on_free_plan &&
                                user.subscription.plan.free
                                  ? () => {}
                                  : this.handleCheckPlan
                              }
                              to={`/apps/${this.props.match.params.appId}/integrations/${this.props.platform}/edit/${integration.id}`}
                              className="button button_blue integrations-request__block-right__button"
                            >
                              <span>Configure</span>
                            </NavLink>
                          )}
                          {!integration.persisted && integration.enabled && (
                            <NavLink
                              onClick={
                                integration.available_on_free_plan &&
                                user.subscription.plan.free
                                  ? () => {}
                                  : this.handleCheckPlan
                              }
                              to={`/apps/${this.props.match.params.appId}/integrations/${this.props.platform}/edit/${integration.id}`}
                              className="button button_green integrations-request__block-right__button"
                            >
                              <span>Add integration</span>
                            </NavLink>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
        </div>
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
  fetchIntegrationsRequest,
  fetchApphooksRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationsList)
