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
import AndroidAppSettings from "../AppSettings/AndroidAppSettings/AndroidAppSettings"
import Webhooks from "./MenuItems/Webhooks"
import IntegrationsShow from "./IntegrationsShow/IntegrationsShow"
import WebhooksShow from "./WebhooksShow/WebhooksShow"
import IntegrationsIOS from "./MenuItems/IntegrationsIOS"
import IntegrationsAndroid from "./MenuItems/IntegrationsAndroid"

class Integrations extends Component {
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

  componentDidMount() {
    document.title = "Apphud | Integrations"
  }

  render() {
    const { application } = this.props;

    return (
      <div className="container-content__wrapper">
        <div className="left-subbar">
          <NavLink
            to={`/apps/${this.props.match.params.appId}/integrations/ios`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>iOS</span>
          </NavLink>
          {application.package_name && <NavLink
            to={`/apps/${this.props.match.params.appId}/integrations/android`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>Android</span>
          </NavLink> }
          <NavLink
            to={`/apps/${this.props.match.params.appId}/integrations/webhooks`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>S2S webhooks</span>
            <span className="tag tag-pro">PRO</span>
          </NavLink>
          {/*<NavLink*/}
          {/*  to={`/apps/${this.props.match.params.appId}/integrations/api`}*/}
          {/*  activeClassName="left-subbar__item_active"*/}
          {/*  className="left-subbar__item"*/}
          {/*>*/}
          {/*  <span>API</span>*/}
          {/*  <span className="tag tag-pro">PRO</span>*/}
          {/*</NavLink>*/}
        </div>
        <div className="container-content container-content__blue container-content__appsettings">
          <Route exact component={IntegrationsIOS} path="/apps/:appId/integrations/ios" />

          <Route exact component={IntegrationsAndroid} path="/apps/:appId/integrations/android" />

          <Route exact component={Webhooks} path="/apps/:appId/integrations/webhooks" />
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Integrations)
