import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchUserRequest } from 'actions/user';
import BillingPlan from './BillingPlan';
import PaymentMethod from './PaymentMethod';
import Invoices from './Invoices';
import { fetchBillingUsageStats } from 'actions/billing';

class Billing extends Component {
  state = {
    upgradePlanModal: false,
    invoices: [],
  };

  componentDidMount() {
    this.getInvoices();
    this.props.fetchUserRequest();
    this.props.fetchBillingUsageStats();
  }

  getInvoices = () => {
    this.setState({ loading: true });
    axios.get('/billing/charges').then((response) => {
      const { results } = response.data.data;
      this.setState({
        invoices: results.slice(0, 36),
        loading: false
      });
    });
  };

  render() {
    const { invoices } = this.state;
    const { userBillingUsage } = this.props;
    const {
      subscription,
      payment_method,
      customer_id
    } = this.props.user;
    const { plan, current_period_start, current_period_end } = subscription;
    return (
      <div className="container-content__profile-billing">
        { userBillingUsage && <BillingPlan
              plan={plan}
              usage_stats={userBillingUsage}
              current_period_start={current_period_start}
              current_period_end={current_period_end}
          />
        }
        <PaymentMethod payment_method={payment_method} />
        {customer_id && userBillingUsage && (
          <Invoices
            plan={plan}
            subscription={subscription}
            usage_stats={userBillingUsage}
            invoices={invoices}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    userBillingUsage: state.user.usage_stats,
  };
};

const mapDispatchToProps = {
  fetchUserRequest,
  fetchBillingUsageStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
