import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BarChart } from 'components';
import dispatchers from 'js/redux/app/dashboard.dispatchers';

import CN from 'classnames';
import css from './Widget.css';

function mapStateToProps(state) {
  return {
    chartData: state.dashboard.data.chartData
  };
}

class ChartWidget extends PureComponent {
  static propTypes = {
    chartData: PropTypes.object
  };

  render() {
    const { chartData: { countByStatusMonthly, countByStatusDaily } } = this.props;
    return (
      <div className={ CN(css.widget50, 'mt-20 card') }>
        <BarChart
          yAxisLabel="Orders"
          generalTitle="Monthly Completed/Cancelled Orders"
          extendedTitle="Daily Completed/Cancelled Orders"
          generalData={ countByStatusMonthly }
          extendedData={ countByStatusDaily }
          name="monthly_completed_cancelled_orders_chart"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(ChartWidget);
