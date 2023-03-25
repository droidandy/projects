import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Desktop, Icon, Button } from 'components';
import HtmlToPdfDownloader from 'utils/HtmlToPdfDownloader';
import { connect } from 'react-redux';
import StatisticCharts from './StatisticCharts';
import dispatchers from 'js/redux/app/charts.dispatchers';

function mapStateToProps({ charts, session: { can } }, { match: { path } }) {
  return {
    ...charts,
    can,
    isProcurementStatistic: /\/procurement_statistics/.test(path)
  };
}

class Charts extends PureComponent {
  static propTypes = {
    getCharts: PropTypes.func,
    isProcurementStatistic: PropTypes.bool,
    can: PropTypes.object
  };

  componentDidMount() {
    this.props.getCharts(this.props.isProcurementStatistic);
  }

  componentDidUpdate(prevProps) {
    const { getCharts, isProcurementStatistic } = this.props;

    if (prevProps.isProcurementStatistic !== isProcurementStatistic) {
      getCharts(isProcurementStatistic);
    }
  }

  exportPdf = () => {
    const component = <StatisticCharts isPdf { ...this.props } />;
    const downloader = new HtmlToPdfDownloader(component);
    return downloader.download('/documents/company_statistics.pdf');
  };

  render() {
    const { can } = this.props;

    return (
      <Fragment>
        <div className="layout horizontal center mb-30">
          <div className="page-title flex">Statistics</div>
          { can && can.exportBookings &&
            <Desktop>
              <Button onClick={ this.exportPdf } type="primary" className="mr-10">
                <Icon className="text-20 mr-10" icon="MdFileDownload" />
                Export
              </Button>
            </Desktop>
          }
        </div>
        <StatisticCharts { ...this.props } />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Charts);
