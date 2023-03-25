import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PieChart, Desktop } from 'components';
import dispatchers from 'js/redux/app/reports.dispatchers';
import moment from 'moment';
import sumBy from 'lodash/sumBy';

function mapStateToProps(state) {
  return {
    fleetReports: state.reports.fleetReports,
    loadingFleetReports: state.reports.loadingFleetReports
  };
}

class PieCharts extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    fleetReports: PropTypes.array,
    loadingFleetReports: PropTypes.bool,
    period: PropTypes.number,
    getFleetReports: PropTypes.func
  };

  componentDidMount() {
    this.props.getFleetReports();
  }

  get periodRange() {
    const offset = this.props.period;
    return [moment().add(offset, 'weeks').startOf('isoWeek'), moment().add(offset, 'weeks').endOf('isoWeek')];
  }

  get acceptanceData() {
    const { fleetReports } = this.props;
    if (!fleetReports.length) { return []; }

    const rates = fleetReports.filter(r => moment(r.date).isBetween(...this.periodRange, null, '[]'));
    const acceptanceRate = Math.round(sumBy(rates, 'acceptanceForPeriod') / rates.length * 10) / 10;
    return [{ name: 'Accepted Offers', value: acceptanceRate, color: '#2a99f5' }, { name: 'Rejected/Ignored Offers', value: (1000 - acceptanceRate * 10) / 10, color: '#485975' }];
  }

  get completionData() {
    const { fleetReports } = this.props;
    if (!fleetReports.length) { return []; }

    const rates = fleetReports.filter(r => moment(r.date).isBetween(...this.periodRange, null, '[]'));
    return [{ name: 'Completed Order', value: sumBy(rates, 'completedForPeriod'), color: '#2a99f5' }, { name: 'Canceled Orders', value: sumBy(rates, 'canceledForPeriod'), color: '#485975' }];
  }

  render() {
    const acceptanceData = this.acceptanceData;
    const completionData = this.completionData;

    return (
      <div className={ this.props.className }>
        <Desktop>
          { matches => [
            <PieChart key="piechartAcceptanceData" matches={ matches } data={ acceptanceData } title="Acceptance Rate" />,
            <PieChart key="piechartCompletionData" matches={ matches } data={ completionData } title="Completion Rate" />
          ] }
        </Desktop>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(PieCharts);
