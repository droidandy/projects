import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tabs } from 'antd';
import css from 'pages/shared/bookings/style.css';

const { TabPane } = Tabs;

export default class FlightStats extends PureComponent {
  static propTypes = {
    flights: PropTypes.arrayOf(PropTypes.object)
  };

  renderFlight(flightData) {
    const { carrier, flight, departure, arrival } = flightData;
    const depTime = moment(departure.time).format('DD/MM/YYYY HH:mm');
    const arrTime = moment(arrival.time).format('DD/MM/YYYY HH:mm');

    return (
      <div data-name="flightStats" className="text-12">
        <div className="layout horizontal mb-30">
          <div className={ `mr-20 medium-grey-text bold-text ${css.width70}` }>Flight №</div>
          <div className="flex auto dark-grey-text bold-text">{ `${carrier} ${flight}` }</div>
        </div>
        <div className="layout horizontal mb-30">
          <div className={ `mr-20 medium-grey-text bold-text ${css.width70}` }>Departure</div>
          <div className="flex auto dark-grey-text bold-text">{ depTime }</div>
        </div>
        <div className="layout horizontal mb-30">
          <div className={ `mr-20 medium-grey-text bold-text ${css.width70}` }>Arrival</div>
          <div className="flex auto dark-grey-text bold-text">{ arrTime }</div>
        </div>
        <div className="layout horizontal mb-30">
          <div className={ `mr-20 medium-grey-text bold-text ${css.width70}` }>From</div>
          <div className="flex auto dark-grey-text bold-text">{ departure.name } { departure.terminal ? ` - Terminal ${departure.terminal}` : '' }</div>
        </div>
        <div className="layout horizontal">
          <div className={ `mr-20 medium-grey-text bold-text ${css.width70}` }>To</div>
          <div className="flex auto dark-grey-text bold-text">{ arrival.name } { arrival.terminal ? ` - Terminal ${arrival.terminal}` : '' }</div>
        </div>
      </div>
    );
  }

  render() {
    const { flights } = this.props;

    if (!flights.length) return null;

    return (
      <div className="mt-20">
        { flights.length > 1
          ? <Tabs defaultActiveKey="0">
              { flights.map((flight, i) => {
                  const { departure, arrival } = flight;

                  return (
                    <TabPane key={ i } tab={ `${departure.code} to ${arrival.code}` }>
                      { this.renderFlight(flight) }
                    </TabPane>
                  );
                })
              }
            </Tabs>
          : this.renderFlight(flights[0])
        }
      </div>
    );
  }
}
