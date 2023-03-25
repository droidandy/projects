import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import history from "../../../history";
import DashboardItem from "../../../components/DashboardItem";
import { getDateFromURI, setDateToURI, track } from "../../../libs/helpers";
import DashboardChecklist from "./DashboardChecklist";
import {
  fetchApplicationRequest,
  updateConversionsDashboardRequest,
  updateDashboardsRequest
} from "../../../actions/application";
import PlatformSwitcher from "./components/PlatformSwitcher";
import Tabs from "./components/Tabs";
import KeyMetrics from "./KeyMetrics";
import {Route, Switch} from "react-router";
import Conversions from "./Conversions";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    document.title = "Apphud | App dashboard";
    this.state = {
      topDashboards: [],
      bottomDashboards: [],
      currentPeriod: getDateFromURI("dashboard"),
      data_old: null
    };
    this.initialize = this.initialize.bind(this);
    this.renderDashboardItem = this.renderDashboardItem.bind(this);
  }

  toParam = (obj) => {
    return Object.keys(obj)
      .map(function(key) {
        return key + "=" + obj[key];
      })
      .join("&");
  };

  initialize() {
    const { settings: { timezone } } = this.props;
    const { appId } = this.props.match.params;
    const { currentPeriod } = this.state;
    const url = this.props.location.pathname;
    const params = this.state.currentPeriod;

    if (url.includes("_old")) {
      axios.get(`${url}?${this.toParam(params)}`).then((response) => {
        const data = response.data.data.results;
        this.setState({ data_old: data });
      });
    }

    this.props.updateDashboardsRequest(appId, currentPeriod, timezone);
    this.props.updateConversionsDashboardRequest(appId, currentPeriod, timezone);
  }

  componentDidUpdate(prevProps) {
    const { settings: { timezone, platform } } = this.props;
    if (timezone !== prevProps.settings.timezone || platform !== prevProps.settings.platform) {
      this.initialize()
    }
  }

  componentWillMount() {
    const { fetchApplicationRequest, match } = this.props;
    const { appId } = match.params;
    fetchApplicationRequest(appId, (app) => {
      if (!app.user_collaboration.show_analytics) {
        history.push(`/apps/${appId}/users`);
      }
    });
  }

  handleChangePeriod = ({ startDate, endDate }) => {
    this.setState(
      {
        currentPeriod: Object.assign(this.state.currentPeriod, {
          start_time: startDate.format("YYYY-MM-DD HH:mm:ss"),
          end_time: endDate.format("YYYY-MM-DD HH:mm:ss")
        })
      },
      () => {
        this.initialize();
        setDateToURI(startDate, endDate, "dashboard")
      }
    );
    track("dashboard_date_range_changed", {
      start_time: startDate.format('YYYY-MM-DD HH:mm:ss'),
      end_time: endDate.format('YYYY-MM-DD HH:mm:ss'),
    })
  };

  renderDashboardItem(item, name) {
    let props = {};
    const { appId } = this.props.match.params;
    const url = this.props.location.pathname;
    const { data_old } = this.state;
    const { application } = this.props;

    let valueOld = null;

    if (name === "Users") {
      valueOld = data_old?.period_specific?.new_users;
    }

    if (name === "Money") {
      valueOld = data_old?.money?.mrr;

      if (item.name === "Gross revenue") {
        valueOld = data_old?.period_specific?.money?.gross;
      }

      if (item.name === "Sales") {
        valueOld = data_old?.period_specific?.money?.sales;
      }

      if (item.name === "Proceeds") {
        valueOld = data_old?.period_specific?.money?.proceeds;
      }

      if (item.name === "Refunds") {
        valueOld = data_old?.period_specific?.money?.refunds;
      }

      if (item.name === "Failed Charges") {
        valueOld = data_old?.period_specific?.money?.failed_charges;
      }
    }

    if (name === "Subscriptions") {
      let subscription;
      const defaultSubscriptions = [
        "Active Regular Subscriptions",
        "Active Trials",
        "Active Intro Offers",
        "Active Promo Offers"
      ];

      if (item.name === "Active Regular Subscriptions") {
        subscription = data_old?.subscriptions?.regular_subscriptions;
      }

      if (item.name === "Active Trials") {
        subscription = data_old?.subscriptions?.trial_subscriptions;
      }

      if (item.name === "Active Intro Offers") {
        subscription = data_old?.subscriptions?.intro_subscriptions;
      }

      if (item.name === "Active Promo Offers") {
        subscription = data_old?.subscriptions?.promo_subscriptions;
      }

      if (item.name === "In Billing Grace Period") {
        subscription = data_old?.subscriptions?.grace_subscriptions;
      }

      if (item.name === "In Billing Retry Period") {
        subscription = data_old?.subscriptions?.billing_retry_subscriptions;
      }

      //
      if (item.name === "New Regular Subscriptions") {
        subscription = data_old?.period_specific?.subscriptions?.new_regular;
      }

      if (item.name === "New Trials") {
        subscription = data_old?.period_specific?.subscriptions?.new_trial;
      }

      if (item.name === "New Intro Offers") {
        subscription = data_old?.period_specific?.subscriptions?.new_intro;
      }

      if (item.name === "New Promo Offers") {
        subscription = data_old?.period_specific?.subscriptions?.new_promo;
      }

      if (defaultSubscriptions.includes(item.name)) {
        valueOld = `${subscription?.autorenew_enabled} + ${subscription?.autorenew_disabled
          } = ${subscription?.autorenew_enabled + subscription?.autorenew_disabled
          }`;
      } else {
        valueOld = subscription;
      }
    }

    if (item.values.length > 2) {
      props = {
        autorenews: item.values.length > 2,
        autorenewsOnCount: item.values[1].value,
        autorenewsOffCount: item.values[2].value
      };
    }

    if (item.chart_id) {
      props = {
        ...props,
        chartUrl: `/apps/${appId}/charts/${item.chart_id}`
      };
    }

    switch (item.type) {
      case "money":
        props.prefix = "$";
        break;
      default:
        break;
    }

    return (
      <DashboardItem
        valueOld={valueOld}
        showOldValue={url.includes("_old")}
        title={item.short_name}
        value={item.values[0].value}
        tipTitle={item.name}
        tipDescription={item.description}
        tipButtonUrl={item.doc_url}
        loading={application.loading || false}
        {...props}
      />
    );
  }

  render() {
    const { currentPeriod } = this.state;
    const { appId } = this.props.match.params;
    const { application, location, match, settings: { timezone } } = this.props;
    const { dashboards, loading, conversions } = application;
    return (
      <div className="container-content container-content__dashboard container-content__blue">
        <div className="dashboard-checklist-wrapper">
        {application.checklist && !application.checklist_completed && (
          <DashboardChecklist appId={appId} />
        )}
        </div>
        <div className="container-content__blue-header container-content__blue-header_pr15 dashboard-top-panel-wrapper">
          <div className="container-title_dashboard-wrapper">
            <div className="container-title container-title_dashboard">
              Dashboard
            </div>
            <PlatformSwitcher />
          </div>
          <div>
            <button
              onClick={() => {
                this.initialize();
                track("dashboard_refresh_button_clicked");
              }}
              disabled={loading}
              className="button button_blue button_icon button_160"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.00001 10.5C3.51001 10.5 1.50001 8.49 1.50001 6C1.50001 3.51 3.51001 1.5 6.00001 1.5C7.24001 1.5 8.36001 2.02 9.17001 2.83L7.00001 5H12V0L10.24 1.76C9.15001 0.68 7.66001 0 6.00001 0C2.69001 0 0.0100098 2.69 0.0100098 6C0.0100098 9.31 2.69001 12 6.00001 12C8.97001 12 11.43 9.84 11.9 7H10.38C9.92001 9 8.14001 10.5 6.00001 10.5Z"
                  fill="white"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
        <Tabs />
        <Switch>
          <Route exact path={`${match.path}`}>
            <KeyMetrics
                dashboards={dashboards}
                currentPeriod={currentPeriod}
                renderDashboardItem={this.renderDashboardItem}
                handleChangePeriod={this.handleChangePeriod}
            />
          </Route>
          <Route exact path={`${match.path}/conversions`}>
            <Conversions
                data={conversions?.items || []}
                loading={loading}
                update={this.props.updateConversionsDashboardRequest}
                currentPeriod={currentPeriod}
                handleChangePeriod={this.handleChangePeriod}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

Dashboard.displayName = "dashboard";

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application,
    settings: state.settings,
    show_analytics: state.application.user_collaboration
      ? state.application.user_collaboration.show_analytics
      : true
  };
};

const mapDispatchToProps = {
  fetchApplicationRequest,
  updateDashboardsRequest,
  updateConversionsDashboardRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
