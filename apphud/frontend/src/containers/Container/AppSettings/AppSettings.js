import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Router, Route, Switch, Redirect } from "react-router-dom"
import { withRouter } from "react-router";
import {
  fetchApplicationRequest,
} from "../../../actions/application";

import General from "./General/General"
import Products from "./Products/Products"
import Team from "./Team/Team"
import AndroidAppSettings from "./AndroidAppSettings/AndroidAppSettings"
import IOSAppSettings from "./IOSApp/IOSAppSettings/IOSAppSettings"
import IOSPushNotifications from "./IOSApp/IOSPushNotifications/IOSPushNotifications"
import IOSLocalization from "./IOSApp/IOSLocalization/IOSLocalization"
import PaywallConfigs from "./PaywallConfigs/PaywallConfigs";

class AppSettings extends Component {
  componentDidMount() {
    this.props.fetchApplicationRequest(this.props.match.params.appId);
    document.title = "Apphud | App settings"
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.props.fetchApplicationRequest(this.props.match.params.appId);
    }
  }

  render() {
    const { application } = this.props;

    return (
      <div className="container-content__wrapper">
        <div className="left-subbar">
          <div className="left-subbar__item_category">
            PROJECT
          </div>
          <NavLink
            to={`/apps/${this.props.match.params.appId}/settings/general`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>General settings</span>
          </NavLink>
          <NavLink
            to={`/apps/${this.props.match.params.appId}/settings/team`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>Team</span>
          </NavLink>
          <div className="left-subbar__item_category left-subbar__item_category_indent-top">
            IOS APP
          </div>
          <NavLink
            to={`/apps/${this.props.match.params.appId}/settings/ios`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>iOS app settings</span>
          </NavLink>
          { application.bundle_id && <> <NavLink
            to={`/apps/${this.props.match.params.appId}/settings/ios-notifications`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>iOS push notifications</span>
          </NavLink>
          <NavLink
            to={`/apps/${this.props.match.params.appId}/settings/ios-localization`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>iOS localization</span>
          </NavLink> </> }
          <div className="left-subbar__item_category left-subbar__item_category_indent-top">
            ANDROID APP
          </div>
          <NavLink
            to={`/apps/${this.props.match.params.appId}/settings/android`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>Android app settings</span>
          </NavLink>
        </div>
        <div className="container-content container-content__blue container-content__appsettings">
          <Route exact component={General} path="/apps/:appId/settings/general" />
          <Route exact component={Team} path="/apps/:appId/settings/team" />

          <Route exact component={IOSAppSettings} path="/apps/:appId/settings/ios" />
          <Route exact component={IOSPushNotifications} path="/apps/:appId/settings/ios-notifications" />
          <Route exact component={IOSLocalization} path="/apps/:appId/settings/ios-localization" />

          <Route exact component={AndroidAppSettings} path="/apps/:appId/settings/android" />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchApplicationRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppSettings))
