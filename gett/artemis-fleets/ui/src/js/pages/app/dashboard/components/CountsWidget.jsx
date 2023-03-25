import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'components';
import { subscribe } from 'utils';
import dispatchers from 'js/redux/app/dashboard.dispatchers';

import css from './CountsWidget.css';

function mapStateToProps(state) {
  return {
    bookingsChannel: state.session.bookingsChannel,
    counts: state.dashboard.data.orderCounts
  };
}

class CountsWidget extends PureComponent {
  static propTypes = {
    ordersChannel: PropTypes.string,
    counts: PropTypes.shape({
      live: PropTypes.number,
      future: PropTypes.number
    }),
    updateOrdersCounts: PropTypes.func
  };

  handleBookingUpdate({ liveModifier, futureModifier }) {
    if (liveModifier !== 0 || futureModifier !== 0) {
      this.props.updateOrdersCounts(liveModifier, futureModifier);
    }
  }

  render() {
    const { live, future } = this.props.counts;
    return (
      <div className="flex sm-full-width mb-20">
        <div className={ `${css.statsLiveFuture} mb-20 layout horizontal light-grey-bg` }>
          <div className="deep-cyan-bg p-20 layout horizontal center">
            <Icon icon="FaListAlt" className="text-40 white-text" />
          </div>
          <div className="flex layout horizontal center p-20">
            <div>
              <div className="text-uppercase bold-text text-12 light-grey-text">Number of live orders</div>
              <div className="text-24 deep-cyan-text light-text">{ live || 'N/A' }</div>
            </div>
          </div>
        </div>

        <div className={ `${css.statsLiveFuture} layout horizontal light-grey-bg` }>
          <div className="deep-cyan-bg p-20 layout horizontal center">
            <Icon icon="FaListAlt" className="text-40 white-text" />
          </div>
          <div className="flex layout horizontal center p-20">
            <div>
              <div className="text-uppercase bold-text text-12 light-grey-text">Number of future orders</div>
              <div className="text-24 deep-cyan-text light-text">{ future || 'N/A' }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(subscribe('bookingsChannel', 'handleBookingUpdate')(CountsWidget));
