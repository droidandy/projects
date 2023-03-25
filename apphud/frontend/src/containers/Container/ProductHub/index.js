import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import { withRouter } from "react-router";
import {
  fetchApplicationRequest
} from "../../../actions/application";
import Products from "../AppSettings/Products/Products";
import PaywallConfigs from "../AppSettings/PaywallConfigs/PaywallConfigs";

class ProductHub extends Component {
  componentDidMount() {
    this.props.fetchApplicationRequest(this.props.match.params.appId);
    document.title = "Apphud | ProductHub"
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
        <div className="left-subbar left-subbar_no_label">
          <NavLink
            to={`/apps/${this.props.match.params.appId}/product_hub/products`}
            activeClassName="left-subbar__item_active"
            className="left-subbar__item"
          >
            <span>Products</span>
          </NavLink>
          <NavLink
              to={`/apps/${this.props.match.params.appId}/product_hub/paywall-configs`}
              activeClassName="left-subbar__item_active"
              className="left-subbar__item"
          >
            <span>Paywalls</span>
          </NavLink>
        </div>
        <div className="container-content container-content__blue container-content__appsettings">
          <Route exact component={Products} path="/apps/:appId/product_hub/products" />
          <Route exact component={PaywallConfigs} path="/apps/:appId/product_hub/paywall-configs" />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductHub))
