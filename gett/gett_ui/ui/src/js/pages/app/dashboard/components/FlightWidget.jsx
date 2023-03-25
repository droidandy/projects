import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import { Input, Spin, Select } from 'antd';
import { Button } from 'components';
import Widget from './Widget';
import dispatchers from 'js/redux/app/dashboard.dispatchers';
import { connect } from 'react-redux';
import { map, isEmpty } from 'lodash';
import { gettAnalytics } from 'utils';
import moment from 'moment';
import css from './FlightWidget.css';
import cssWidget from './Widget.css';

const { Option } = Select;

function mapStateToProps(state) {
  const { memberId, companyId } = state.session;

  return { ...state.dashboard.flight, memberId, companyId };
}

function normalizeAirportName(data) {
  if (!data) return '--';

  return `${data.name} (${data.code})` + (data.terminal ? ` - Terminal ${data.terminal}` : '');
}

function normalizeTime(date) {
  return date ? moment(date).format('H:mm D/M/YYYY') : '--';
}

function normalizeFlight(carrier, flight) {
  return carrier && flight ? `${carrier} ${flight}` : '--';
}

class FlightWidget extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    schedule: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      flights: PropTypes.arrayOf(PropTypes.object)
    })),
    getSchedule: PropTypes.func,
    dropFlight: PropTypes.func,
    memberId: PropTypes.number,
    companyId: PropTypes.number
  };

  static defaultProps = {
    loading: false
  };

  state = {
    flightNumber: '',
    dateIndex: 0,
    error: null
  };

  componentDidUpdate(prevProps) {
    const { schedule } = this.props;
    if (prevProps.schedule !== schedule) {
      const todayIndex = schedule.findIndex(item => moment(item.date).isSame(moment(), 'day'));

      this.setState({ dateIndex: todayIndex < 0 ? 0 : todayIndex });
    }
  }

  changeFlightNumber = (e) => {
    this.setState({ flightNumber: e.target.value, error: null, dateIndex: 0 });
    this.props.dropFlight();
  };

  changeDateIndex = (value) => {
    this.setState({ dateIndex: +value });
  };

  verifyFlight = () => {
    const { memberId, companyId } = this.props;
    gettAnalytics('company_web|dashboard|flight_tracker|check|button_clicked', { companyId, userId: memberId, timestamp: moment() });

    this.setError(null);
    this.props.getSchedule(this.getFlightParams())
      .catch(() => this.setError('Flight number not found, please double check.'));
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

  setError(error) {
    this.setState({ error });
  }

  renderDatesDropdown() {
    const { schedule } = this.props;
    const { dateIndex } = this.state;
    const dates = schedule.map(item => moment(item.date).format('D/M/YYYY'));

    return (
      <Select
        className="full-width mt-20"
        placeholder="Please select"
        onChange={ this.changeDateIndex }
        value={ String(dateIndex) }
      >
        { map(dates, (date, i) => <Option key={ String(i) }>{ date }</Option>) }
      </Select>
    );
  }

  render() {
    const { loading, schedule } = this.props;
    const { error, flightNumber, dateIndex } = this.state;
    const { flights = [] } = schedule[dateIndex] || {};

    return (
      <Widget title="Flight tracker" className={ cssWidget.widget25 }>
          <div className="layout horizontal center-center">
            <div className="flex mr-10">
              <Spin spinning={ loading }>
                <Input
                  onChange={ this.changeFlightNumber }
                  onPressEnter={ this.verifyFlight }
                  value={ flightNumber }
                  placeholder="e.g. EK5"
                  className="flex"
                />
              </Spin>
            </div>
            <Button
              type="primary"
              onClick={ this.verifyFlight }
              disabled={ loading }
            >
              Check
            </Button>
          </div>
          { !isEmpty(schedule) && this.renderDatesDropdown() }
          { error && <div className="text-10 red-text">{ error }</div> }
        <div className={ CN('scroll-box', css.h240) }>
          <table className={ CN(css.table, 'mt-20') }>
            <tbody>
              { flights.length > 1 &&
                <tr className="bold-text">
                  <td />
                  { map(flights, ({ departure, arrival }, i) => (
                      <td key={ i }>{ `${departure.code} to ${arrival.code}` }</td>
                    ))
                  }
                </tr>
              }
              <tr>
                <td className={ CN('bold-text', css.label) }>Flight No.</td>
                { map(flights, ({ carrier, flight }, i) => <td className={ css.result } key={ i }>{ normalizeFlight(carrier, flight) }</td>) }
              </tr>
              <tr>
                <td className={ CN('bold-text', css.label) }>Departure</td>
                { map(flights, ({ departure }, i) => <td className={ css.result } key={ i }>{ normalizeTime(departure.time) }</td>) }
              </tr>
              <tr>
                <td className={ CN('bold-text', css.label) }>Arrival</td>
                { map(flights, ({ arrival }, i) => <td className={ css.result } key={ i }>{ normalizeTime(arrival.time) }</td>) }
              </tr>
              <tr>
                <td className={ CN('bold-text', css.label) }>From</td>
                { map(flights, ({ departure }, i) => <td className={ css.result } key={ i }>{ normalizeAirportName(departure) }</td>) }
              </tr>
              <tr>
                <td className={ CN('bold-text', css.label) }>To</td>
                { map(flights, ({ arrival }, i) => <td className={ css.result } key={ i }>{ normalizeAirportName(arrival) }</td>) }
              </tr>
            </tbody>
          </table>
        </div>
      </Widget>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(FlightWidget);
