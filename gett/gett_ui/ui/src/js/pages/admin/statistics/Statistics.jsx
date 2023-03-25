import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BarChart, CardChart } from 'components';
import { Row, Col } from 'antd';
import { lowerCase } from 'lodash';
import dispatchers from 'js/redux/admin/statistics.dispatchers';

function mapStateToProps({ statistics }) {
  return statistics;
}

class Statistics extends PureComponent {
  static propTypes = {
    enterpriseActiveByScheduleType: PropTypes.array,
    affiliateActiveByScheduleType: PropTypes.array,
    scheduledByCompanyType: PropTypes.array,
    enterpriseByStatus: PropTypes.array,
    affiliateByStatus: PropTypes.array,
    completedByServiceType: PropTypes.array,
    internationalByStatus: PropTypes.array,
    cashByStatus: PropTypes.array,
    accountByStatus: PropTypes.array,
    creditByStatus: PropTypes.array,
    bookersByCompanyType: PropTypes.array,
    passengersByCompanyType: PropTypes.array,
    companiesByCompanyType: PropTypes.array,
    firstTimePassengersByCompanyType: PropTypes.array,
    averageRating: PropTypes.array,
    affiliateMonthly: PropTypes.array,
    affiliateDaily: PropTypes.array,
    enterpriseMonthly: PropTypes.array,
    enterpriseDaily: PropTypes.array,
    getStatistics: PropTypes.func
  };

  componentDidMount() {
    this.props.getStatistics();
  }

  cardCharts = () => {
    const {
      enterpriseActiveByScheduleType,
      affiliateActiveByScheduleType,
      scheduledByCompanyType,
      enterpriseByStatus,
      affiliateByStatus,
      completedByServiceType,
      internationalByStatus,
      cashByStatus,
      accountByStatus,
      creditByStatus,
      bookersByCompanyType,
      passengersByCompanyType,
      companiesByCompanyType,
      firstTimePassengersByCompanyType,
      averageRating
    } = this.props;

    return [
      { data: enterpriseActiveByScheduleType, title: 'Enterprise Active Orders' },
      { data: affiliateActiveByScheduleType, title: 'Affiliate Active Orders' },
      { data: scheduledByCompanyType, title: 'Scheduled Orders Today' },
      { data: enterpriseByStatus, title: 'Enterprise Today' },
      { data: affiliateByStatus, title: 'Affiliate Today' },
      { data: completedByServiceType, title: 'Ot vs Gett Completed Today' },
      { data: internationalByStatus, title: 'International Order Today' },
      { data: cashByStatus, title: 'Cash Order Today' },
      { data: accountByStatus, title: 'Account Order Today' },
      { data: creditByStatus, title: 'Credit Card Order Today' },
      { data: bookersByCompanyType, title: 'Active Bookers Today' },
      { data: passengersByCompanyType, title: 'Riding Users Today' },
      { data: companiesByCompanyType, title: 'Riding Companies Today' },
      { data: firstTimePassengersByCompanyType, title: 'First Time Riders' },
      { data: averageRating, title: 'AVG Rating Today' }
    ];
  };

  renderChart = (name, generalData, extendedData) => (
    <div className="mb-20 chartContainer">
      <BarChart
        generalTitle={ `${name} Monthly Completed/Cancelled/Rejected orders Chart` }
        extendedTitle={ `${name} Daily Completed/Cancelled/Rejected orders Chart` }
        generalData={ generalData }
        extendedData={ extendedData }
        yAxisLabel="Orders"
        name={ `${lowerCase(name)}_monthly_orders_chart` }
        className="pr-30"
      />
    </div>
  )

  render() {
    const {
      affiliateMonthly,
      affiliateDaily,
      enterpriseMonthly,
      enterpriseDaily
    } = this.props;

    return (
      <Fragment>
        <div className="page-title mb-30">Statistics</div>
        { this.renderChart('Enterprise', enterpriseMonthly, enterpriseDaily) }
        { this.renderChart('Affiliate', affiliateMonthly, affiliateDaily) }
        <Row gutter={ 20 } className="mb-40">
          { this.cardCharts().map((chart, i) => <Col key={ i } lg={ 8 } md={ 12 } sm={ 12 } xs={ 24 }><CardChart { ...chart } /></Col>) }
        </Row>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Statistics);
