import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Radio } from 'antd';
import { BarChart } from 'components';
import { SpendReport } from './SpendReport';
import dispatchers from 'js/redux/app/reports.dispatchers';
import moment from 'moment';

function mapStateToProps(state) {
  return {
    fleetReports: state.reports.fleetReports,
    loadingFleetReports: state.reports.loadingFleetReports
  };
}

class Charts extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    fleetReports: PropTypes.array,
    loadingFleetReports: PropTypes.bool,
    getFleetReports: PropTypes.func
  };

  state = {
    period: '30'
  };

  componentDidMount() {
    this.props.getFleetReports();
  }

  handlePeriodChange = (e) => {
    this.setState({ period: e.target.value });
  };

  get filteredFleetReports() {
    const periodStart = moment().subtract(this.state.period, 'days');

    const fleetReports = this.props.fleetReports.filter(r => moment(r.date).isAfter(periodStart));

    const result = {
      completedForPeriod: [],
      acceptanceForPeriod: [],
      avgRatingForPeriod: []
    };
  
    fleetReports.forEach((report) => {
      Object.keys(result).forEach((i) => {
        const value = i === 'completedForPeriod' ? 'completedForPeriod' : 'value';
        result[i].push({ name: report.date, [value]: report[i] });
      });
    });

    return result;
  }

  render() {
    const { period } = this.state;
    const fleetReports = this.filteredFleetReports;

    return (
      <div className={ this.props.className }>
        <div className="layout horizontal end-justified">
          <Radio.Group onChange={ this.handlePeriodChange } value={ period } size="small">
            <Radio.Button value="7">Weekly</Radio.Button>
            <Radio.Button value="30">Monthly</Radio.Button>
          </Radio.Group>
        </div>

        <SpendReport
          data={ fleetReports.acceptanceForPeriod }
          name="Fleet Acceptance Rate"
        />

        <BarChart
          generalTitle="Fleet Completed Orders"
          generalData={ fleetReports.completedForPeriod }
          extendedData={ [fleetReports.completedForPeriod] }
        />

        <SpendReport
          data={ fleetReports.avgRatingForPeriod }
          name="Fleet Driver Efficiency"
          domain={ [0, 5] }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Charts);
