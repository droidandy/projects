import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GoogleMap, { Marker, LiveMarker } from 'components/GoogleMap';
import { TwitterWidget, FlightWidget, ChartWidget, InternalMessageWidget, ExternalMessageWidget } from './components';
import { get } from 'lodash';
import { Count } from './components/Count';
import dashboardDispatchers from 'js/redux/app/dashboard.dispatchers';
import driversDispatchers from 'js/redux/app/drivers.dispatchers';
import { subscribe } from 'utils';
import css from './Dashboard.css';

function mapStateToProps(state) {
  return {
    data: state.dashboard.data,
    driversChannel: state.drivers.channel,
    bookingsChannel: state.session.bookingsChannel,
    counts: state.dashboard.data.bookingCounts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...dashboardDispatchers.mapToProps(dispatch),
    ...driversDispatchers.mapToProps(dispatch)
  };
}

class Dashboard extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    driversChannel: PropTypes.string,
    getDashboard: PropTypes.func,
    getDriversChannel: PropTypes.func,
    bookingsChannel: PropTypes.string,
    counts: PropTypes.shape({
      live: PropTypes.number,
      future: PropTypes.number
    }),
    updateBookingCounts: PropTypes.func
  };

  state = {
    drivers: []
  };

  componentDidMount() {
    this.props.getDashboard();
    this.props.getDriversChannel();
  }

  handleDriversUpdate({ drivers, diesIn }) {
    this.setState({ drivers });

    if (diesIn < 6) {
      // send a request to update channel's `valid_until` property to keep it alive
      this.props.getDriversChannel();
    }
  }

  handleBookingUpdate({ liveModifier, futureModifier }) {
    if (liveModifier !== 0 || futureModifier !== 0) {
      this.props.updateBookingCounts(liveModifier, futureModifier);
    }
  }

  getValue(path, defalt = '-') {
    return get(this.props.data, path) || defalt;
  }

  renderGoogleMap() {
    const { address } = this.props.data;
    const { drivers } = this.state;

    return (
      <GoogleMap
        height={ 420 }
        wrapperClassName={ `flex mb-20 mt-20 ${css.mapWrapper}` }
        className={ css.map }
        center={ address }
      >
        { address && <Marker position={ address } title={ address.line } icon="personal-location" /> }
        { drivers.map(driver =>
            <LiveMarker key={ driver.id } positions={ driver.locations } icon="driver" color="#249cff" />
          )
        }
      </GoogleMap>
    );
  }

  render() {
    const { data: { can }, counts: { live, future } } = this.props;

    return (
      <Fragment>
        <div className="page-title mb-30">Dashboard</div>
        <div className="layout start wrap full-width">
          <div className={ 'flex layout horizontal justified wrap full-width' }>
            <Count
              title="Total of bookings taken"
              count={ this.getValue('bookingsCount', 0) }
              icon="Bookings"
              name="totalTaken"
            />
            <Count
              title="Total spend"
              count={ `£${this.getValue('bookingsSum', 0)}` }
              icon="Money"
              name="totalSpend"
            />
            <Count
              title="Live bookings"
              count={ live }
              icon="Live"
              name="liveNumber"
            />
            <Count
              title="Future orders"
              count={ future }
              icon="Future"
              name="futureNumber"
            />
          </div>
        </div>
        <div className="flex layout start horizontal justified wrap full-width">
          <ChartWidget />
          { this.renderGoogleMap() }
        </div>
        <div className="flex layout horizontal justified wrap full-width">
          <TwitterWidget />
          <ExternalMessageWidget className="flex xs-full-width" />
          <InternalMessageWidget
            showForm={ can.sendMessage }
            className="flex xs-full-width"
            name="internalMessage"
          />
          <FlightWidget />
        </div>
      </Fragment>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  subscribe('driversChannel', 'handleDriversUpdate', 'bookingsChannel', 'handleBookingUpdate')(Dashboard)
);
