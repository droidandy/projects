import React, { Component } from "react"
import { connect } from "react-redux"
import { Router, Route, Switch, Redirect, matchPath } from "react-router-dom"
import { QueryParamProvider } from 'use-query-params';

import history from "./history"
import Aux from "./hoc/Aux"
import SignIn from "./containers/SignIn/SignIn"
import SignUp from "./containers/SignUp/SignUp"
import ContactInfo from "./containers/ContactInfo/ContactInfo"
import ResetPassword from "./containers/ResetPassword/ResetPassword"
import ResetPasswordSuccess from "./containers/ResetPassword/ResetPasswordSuccess"
import LeftBar from "./components/LeftBar"
import Container from "./containers/Container/Container"
import NewApp from "./containers/NewApp/NewApp"
import Profile from "./containers/Profile/Profile"
import Demo from "./containers/Demo/Demo"
import ConfigureApp from "./containers/NewApp/ConfigureApp/ConfigureApp"
import ReachLimitPanel from "./components/ReachLimitPanel"
import CantRenewPanel from "./components/CantRenewPanel"
import CantRenewModal from "./components/CantRenewModal"
import UpgradeModal from "./components/UpgradeModal"
import ReachLimitModal from "./components/ReachLimitModal"
import ConfirmEmailPanel from "./containers/Common/ConfirmEmailPanel"
import { fetchUserRequest } from "./actions/user"
import { fetchApplicationRequest } from "./actions/application"
import { Error404 } from "containers/Error404"
import {fetchApplicationsRequest} from "./actions/applications";
import LocalStorageService from "./libs/TokenService";
import jwtDecode from "jwt-decode";

const GET_APP_INTERVAL = 60000 // milliseconds
const TWENTY_FOUR_HOURS = 24 * 60 * 60

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location.pathname } }} />
          )
      }
    />
  )
}

class Routes extends Component {
  state = {
    showUpgradeModal: false,
    showCantRenewModal: false,
    showReachLimitModal: false,
    showConfirmEmailPanel: false
  };

  authed = () => {
    return !!this.props.userId
  };

  showReachLimitPanel = () => {
    const { application } = this.props

    if (window.location.pathname.indexOf("/apps/") > -1) {
      if (
        application.user &&
        application.user.subscription &&
        application.user.subscription.status === "grace" &&
        application.user.subscription.plan &&
        application.user.subscription.plan.free
      ) { return true }
    }

    return false
  };

  showCantRenewPanel = () => {
    const { application } = this.props

    if (window.location.pathname.indexOf("/apps/") > -1) {
      if (
        application.user &&
        application.user.subscription &&
        application.user.subscription.status === "past_due"
      ) {
        return true
      }
    }

    return false
  };

  handleCloseReachLimitModal = () => {
    this.setState({ showReachLimitModal: false })
  };

  handleCloseUpgradeModal = () => {
    this.setState({ showUpgradeModal: false })
  };

  handleCloseCantRenewModal = () => {
    this.setState({ showCantRenewModal: false })
  };

  checkAccess = (location) => {
    const { application, userBillingUsage, user } = this.props
    const match = matchPath(location.pathname, {
      path: "/apps/:appId"
    })
    if (application.user) {
      if (location.pathname.indexOf("/apps/") > -1) {
        const currentTime = new Date().getTime()
        const savedTime = parseInt(localStorage.getItem("upgradeModalShow"))
        const didShowForPeriod = localStorage.getItem("didShowForPeriod")

        if (
          this.showReachLimitPanel() &&
          (!savedTime || currentTime > savedTime + TWENTY_FOUR_HOURS)
        ) {
          this.setState({ showUpgradeModal: true })
          localStorage.setItem("upgradeModalShow", currentTime)
        }

        // if (this.showReachLimitPanel() && (!savedTime || currentTime > savedTime + TWENTY_FOUR_HOURS)) {
        //   if (application.user_collaboration.role === 'owner') {
        //     this.setState({showUpgradeModal: true})
        //     localStorage.setItem('upgradeModalShow', currentTime)
        //   }
        // }
        // else
        //   this.setState({showUpgradeModal: false})

        if (
          !application.user.subscription.plan.free && userBillingUsage &&
          parseFloat(userBillingUsage.mtr_total) > parseFloat(user.subscription.plan.mtr)
        ) {
          if (
            !didShowForPeriod ||
            didShowForPeriod !==
            application.user.subscription.current_period_start
          ) {
            this.setState({ showReachLimitModal: true })
            localStorage.setItem(
              "didShowForPeriod",
              application.user.subscription.current_period_start
            )
          }
        }

        const cantRenewModal_savedTime = parseInt(
          localStorage.getItem("cantRenewModal")
        )

        if (
          this.showCantRenewPanel() &&
          (!cantRenewModal_savedTime ||
            currentTime > cantRenewModal_savedTime + TWENTY_FOUR_HOURS)
        ) {
          this.setState({
            showCantRenewModal: true
          })
          localStorage.setItem("cantRenewModal", currentTime)
        }

        if (match) {
          if (
            application.user.status === "suspended" &&
            [`/apps/${match.params.appId}/suspended`, "/profile"].indexOf(
              location.pathname
            ) === -1
          ) {
            setTimeout(() => {
              history.push(`/apps/${match.params.appId}/suspended`)
            })
          }
        }
      }
    }

    if (location.pathname.indexOf("profile") > -1) {
      this.setState({
        showUpgradeModal: false,
        showCantRenewModal: false
      })
    }
  };

  componentDidMount() {
    this.checkAccess(history.location)

    if (this.authed() && window.analytics) {
      const { email, name, id, company_name, phone } = this.props.user
      let timezone = ""
      const params = {
        email,
        name,
        phone
      }

      if (Intl) timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      if (company_name) {
        params.company = {
          name: company_name,
          id: company_name
        }
      }

      window.segmentHelper.identify(id, params, {
        integrations: {
          All: true,
          Webhooks: false
        },
        context: {
          timezone
        }
      })
    }
  }

  constructor(props) {
    super(props)

    document.addEventListener("apphud.appRequested", () =>
      this.checkAccess(history.location)
    )

    history.listen((location, action) => {
      this.setState({ showConfirmEmailPanel: this.showConfirmEmailPanel() })
    })
  }

  showConfirmEmailPanel = () => {
    const { status } = this.props

    return (
      status &&
      status === "pending" &&
      window.location.pathname.indexOf("/apps/") > -1
    )
  };

  componentDidMount() {
    this.props.fetchApplicationsRequest(() => {})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application?.id !== prevProps.application?.id) {
      const { id, bundle_id, name, appstore_app_id } = this.props.application;
      this.flushDataToIntercom(id, bundle_id, appstore_app_id, name);
    }

    try {
      const originalToken = jwtDecode(LocalStorageService.getOriginalToken());
      if (originalToken?.status !== "admin") {
        const switchUserToken = LocalStorageService.getSwitchUserToken();
        if (switchUserToken) {
          window.location.href = `${window.location.origin}`
        }
      }
    } catch (e) {

    }
  }


  setIntervalFetchToApplication = () => {
    const { fetchApplicationRequest, application } = this.props
    const appId = application?.id;

    this.setState({
      intervalId: setInterval(() => {
        if (this.authed() && appId) {
          fetchApplicationRequest(appId, () => {
            this.checkAccess(history.location)
          })
        }
      }, GET_APP_INTERVAL)
    })
  }

  flushDataToIntercom(appId, bundleId, appStoreId, name) {
    window.intercomSettings = {
      _app_id: appId,
      _app_bundle_id: bundleId,
      _name: name,
      _app_appstore_id: appStoreId

    }
    if (window.Intercom !== undefined) {
      window.Intercom("update");
    }
  }

  render() {
    const { user, application, userBillingUsage } = this.props
    const {
      showUpgradeModal,
      showCantRenewModal,
      showReachLimitModal,
      showConfirmEmailPanel
    } = this.state

    return (
      <Router history={history}>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Aux>
            <Switch>
              <Aux>
                <Route component={Demo} path="/demo/:id" />
                <Route component={SignUp} path="/sign_up" />
                <Route exact component={SignIn} path="/" />
                <Route component={ResetPassword} path="/reset_password/:code" />
                <Route
                  component={ResetPasswordSuccess}
                  path="/reset_password_success"
                />
                <Aux>
                  {showConfirmEmailPanel && <ConfirmEmailPanel />}
                  {this.showReachLimitPanel() && (
                    <ReachLimitPanel
                      application={application}
                      planName={application.user.subscription.plan.name}
                    />
                  )}
                  {this.showCantRenewPanel() && (
                    <CantRenewPanel application={application} />
                  )}
                  {showCantRenewModal && (
                    <CantRenewModal
                      application={application}
                      close={this.handleCloseCantRenewModal}
                    />
                  )}
                  {showUpgradeModal && (
                    <UpgradeModal
                      userBillingUsage={userBillingUsage}
                      application={application}
                      close={this.handleCloseUpgradeModal}
                    />
                  )}
                  {showReachLimitModal && (
                    <ReachLimitModal
                      user={user}
                      userBillingUsage={userBillingUsage}
                      close={this.handleCloseReachLimitModal}
                    />
                  )}
                  <PrivateRoute
                    authed={this.authed()}
                    exact
                    component={ContactInfo}
                    path="/contact-info"
                  />
                  <PrivateRoute
                    authed={this.authed()}
                    exact
                    component={NewApp}
                    path="/newapp"
                  />
                  <PrivateRoute
                    authed={this.authed()}
                    component={LeftBar}
                    path="/apps/:appId"
                  />
                  <PrivateRoute
                    authed={this.authed()}
                    component={Container}
                    path="/apps/:appId"
                  />
                  <PrivateRoute
                    authed={this.authed()}
                    component={ConfigureApp}
                    path="/configureapp/:appid/:step"
                  />
                  <PrivateRoute
                    authed={this.authed()}
                    component={Profile}
                    path="/profile"
                  />
                </Aux>
              </Aux>
            </Switch>
          </Aux>
        </QueryParamProvider>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.sessions.status,
    userId: state.sessions.id,
    user: state.sessions,
    userBillingUsage: state.user.usage_stats,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchUserRequest,
  fetchApplicationRequest,
  fetchApplicationsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)
