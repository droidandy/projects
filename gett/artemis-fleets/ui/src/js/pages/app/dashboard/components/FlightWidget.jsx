import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Spin } from 'antd';
import { Icon } from 'components';
import dispatchers from 'js/redux/app/dashboard.dispatchers';
import { connect } from 'react-redux';
import moment from 'moment';
import css from './FlightWidget.css';

function mapStateToProps(state) {
  return state.dashboard.flight;
}

class FlightWidget extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    schedule: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        flight: PropTypes.string,
        departure: PropTypes.object,
        arrival: PropTypes.object
      })
    ]),
    getFlights: PropTypes.func,
    dropFlight: PropTypes.func
  };

  static defaultProps = {
    loading: false
  };

  state = {
    flightNumber: '',
    error: null
  };

  handleChange = (e) => {
    this.setState({ flightNumber: e.target.value, error: null });
    this.props.dropFlight();
  };

  verifyFlight = () => {
    this.setError(null);
    this.props.getFlights(this.getFlightParams())
      .catch(() => { this.setError('Flight number not found, please double check.'); });
  };

  getFlightParams() {
    const date = moment();

    return {
      flight: this.state.flightNumber,
      year: date.year(),
      month: date.month() + 1,
      day: date.date()
    };
  }

  setError = (error) => {
    this.setState({ error });
  };

  normalizeAirportName(data) {
    if (!data) {
      return '--';
    } else {
      return `${data.name} (${data.code}) - Terminal ${data.terminal}`;
    }
  }

  normalizeDate(data) {
    if (!data) {
      return '--';
    } else {
      return moment(data.time).format('H:mm D/M/YYYY');
    }
  }

  render() {
    const { loading, schedule } = this.props;
    const { error, flightNumber } = this.state;
    const { carrier, flight, departure, arrival } = (schedule || {});

    return (
      <div className={ `flex sm-full-width bold-text mr-20 xs-mr-0 xs-mb-20 mb-20 xs-ml-0 ${css.widget}` }>
        <div className="layout horizontal center white-text orange-bg pt-10 pb-15 pr-20 pl-20">
          <Icon icon="MdFlight" className="text-40 mr-20" />
          <div className="flex">
            <div className="text-12">Flight Tracker</div>
            <div className="text-20 light-text">Flight  №</div>
            <div className="layout horizontal center-center">
              <div className="flex mr-10">
                <Spin spinning={ loading }>
                  <Input
                    onChange={ this.handleChange }
                    onPressEnter={ this.verifyFlight }
                    placeholder="e.g. EK5"
                    value={ flightNumber }
                    className={ css.input }
                  />
                </Spin>
              </div>
              <div className="pointer text-20 light-text" onClick={ this.verifyFlight } disabled={ loading }>Check</div>
            </div>
            { error && <div className="text-10">{ error }</div> }
          </div>
        </div>
        <table className={ `${css.table} border-left border-right` }>
          <tbody>
            <tr><td>Flight №</td><td>{ carrier && flight ? `${carrier} ${flight}` : '--' }</td></tr>
            <tr><td>Departure</td><td>{ this.normalizeDate(departure) }</td></tr>
            <tr><td>Arrival</td><td>{ this.normalizeDate(arrival) }</td></tr>
            <tr><td>From</td><td>{ this.normalizeAirportName(departure) }</td></tr>
            <tr><td>To</td><td>{ this.normalizeAirportName(arrival) }</td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(FlightWidget);
