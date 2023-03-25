import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Router, Route, Switch, Redirect } from 'react-router-dom';
import TopPanel from './TopPanel/TopPanel';
import AppSettings from './AppSettings/AppSettings';
import Users from './Users/Users';
import Events from './Events/Events';
import Integrations from './Integrations/Integrations';
import IntegrationsShow from './Integrations/IntegrationsShow/IntegrationsShow';
import WebhooksShow from './Integrations/WebhooksShow/WebhooksShow';
import Dashboard from './Dashboard/Dashboard';
import PushRules from './PushRules/PushRules';
import PushRulesShow from './PushRules/PushRulesShow/PushRulesShow';
import Rules from './Rules/Rules';
import RulesShow from './Rules/RulesShow/RulesShow';
import RulesAnalyze from './Rules/RulesAnalyze/RulesAnalyze';
import Screens from './Screens/Screens';
import UsersShow from './Users/UsersShow/UsersShow';

import { fetchApplicationRequest } from '../../actions/application';
import { fetchUserRequest } from '../../actions/user';
import { fetchRulesRequest } from '../../actions/rules';
import Suspended from './Suspended';
import { Error404 } from 'containers/Error404';
import AppPanel from "./TopPanel/AppPanel";
import Aux from "../../hoc/Aux";
import ProductHub from "./ProductHub";
import Charts from "./Charts";
import Cohorts from "./Cohorts";

class Container extends Component {
  state = {
    error: false,
  };

  componentDidMount() {
    this.props.fetchUserRequest();
    this.props.fetchRulesRequest({ appId: this.props.match.params.appId });
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.state.error) this.setState({ error: false });
  };

  render() {
    const { error } = this.state;

    return error ? (
      <div />
    ) : (
        <div className="container">
            <AppPanel />
            <TopPanel currentAppId={this.props.match.params.appId} />
          <Switch>

          <Route component={Suspended} path="/apps/:appId/suspended" />
          <Route component={AppSettings} path="/apps/:appId/settings" />
          <Route component={ProductHub} path="/apps/:appId/product_hub" />
          <Route exact component={Users} path="/apps/:appId/users" />
          <Route exact component={UsersShow} path="/apps/:appId/users/:userId" />

          <Route exact component={Events} path="/apps/:appId/events" />

          <Route
            component={IntegrationsShow}
            path="/apps/:appId/integrations/:platform/edit/:integrationId"
          />
          <Route
            exact
            component={Integrations}
            path="/apps/:appId/integrations/:platform"
          />
          <Route
            exact
            component={WebhooksShow}
            path="/apps/:appId/integrations/webhooks/:webhookId"
          />

          <Route component={Dashboard} path="/apps/:appId/dashboard" />
          <Route exact component={Dashboard} path="/apps/:appId/dashboard_old" />
          <Route component={Charts} path="/apps/:appId/charts" />
          <Route component={Cohorts} path="/apps/:appId/cohorts" />

          <Route exact component={PushRules} path="/apps/:appId/rules" />
          <Route component={PushRulesShow} path="/apps/:appId/rules/:ruleId" />

          <Route
            exact
            component={Rules}
            path="/apps/:appId/newrules/:rulesType"
          />
          <Route
            component={RulesAnalyze}
            path="/apps/:appId/newrules/:rulesType/:ruleId/analyze"
          />
          <Route
            component={RulesShow}
            path="/apps/:appId/newrules/:rulesType/:ruleId/configure/:step"
          />

          <Route
            exact
            component={Screens}
            path="/apps/:appId/screens/:screensType"
          />
          <Route
            component={Error404}
            path="/apps/*"
          />
          </Switch>
        </div>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
  };
};

const mapDispatchToProps = {
  fetchApplicationRequest,
  fetchUserRequest,
  fetchRulesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
