import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Input, Radio } from 'antd';
import { strFilter } from 'utils';
import dispatchers from 'js/redux/app/reports.dispatchers';
import sortBy from 'lodash/sortBy';

function mapStateToProps(state) {
  return {
    reports: state.reports.reports,
    loadingReports: state.reports.loadingReports,
  };
}

class Reports extends PureComponent {
  static propTypes = {
    reports: PropTypes.array,
    loadingReports: PropTypes.bool,
    getReports: PropTypes.func,
  };

  state = {
    searchValue: '',
    sorter: {},
    period: 0
  };

  componentDidMount() {
    this.props.getReports();
  }

  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  handlePeriodChange = (e) => {
    const period = e.target.value;
    this.setState({ period });
    const week = period === 0 ? 'current' : 'previous';
    this.props.getReports(week);
  };

  onTableChange = (_, __, sorter) => {
    this.setState({ sorter });
  };

  get filteredReports() {
    const searchValue = this.state.searchValue;
    return this.props.reports.filter(r => strFilter(r.driverId + r.driverName, searchValue));
  }

  get sortedReports() {
    const { field, order } = this.state.sorter;
    let sortedReports = sortBy(this.filteredReports, field);
    if (order === 'descend') { sortedReports.reverse(); }
    return sortedReports;
  }

  render() {
    const { loadingReports } = this.props;
    const { searchValue, period } = this.state;

    return (
      <div className="p-20">
        <div className="layout horizontal center h-40 mb-10">
          Search by
          <Input.Search className="ml-10" style={ { width: 200 } } placeholder="Driver id or driver name" value={ searchValue } onChange={ this.handleSearch } />
          <Radio.Group className="justified-right" onChange={ this.handlePeriodChange } value={ period } size="small">
            <Radio.Button value={ -1 }>Last Week</Radio.Button>
            <Radio.Button value={ 0 }>Current Week</Radio.Button>
          </Radio.Group>
        </div>
        <div className="layout horizontal">
          <div className="flex mr-20">
            <Table
              rowKey="id"
              dataSource={ this.sortedReports }
              loading={ loadingReports }
              onChange={ this.onTableChange }
              columns={ [
                {
                  title: 'Driver ID',
                  dataIndex: 'driverId',
                  sorter: true
                },
                {
                  title: 'Driver Name',
                  dataIndex: 'driverName',
                  sorter: true
                },
                {
                  title: 'Driver Phone',
                  dataIndex: 'driverPhone',
                  sorter: true
                },
                {
                  title: 'Completed Jobs',
                  dataIndex: 'completedForPeriod',
                  sorter: true
                },
                {
                  title: 'Acceptance Rate',
                  dataIndex: 'acceptanceForPeriod',
                  sorter: true
                },
                {
                  title: 'Driver Rating',
                  dataIndex: 'avgRatingForPeriod',
                  sorter: true
                }
              ] }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Reports);
