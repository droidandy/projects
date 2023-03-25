import { reduce } from 'js/redux';
import update from 'update-js';
import { flightstatsReducers, initialState as flightstatsState } from 'utils/flightstats';

const initialState = {
  data: {
    chartData: {
      name: '',
      completedOrders: {}
    },
    bookingCounts: {},
    internalMessages: [],
    externalMessages: [],
    can: {}
  },
  flight: flightstatsState
};

export default reduce('dashboard', initialState, (reducer) => {
  reducer('getDashboardSuccess', (state, data) => {
    return { ...state, data };
  });

  reducer('updateBookingCounts', (state, liveModifier, futureModifier) => {
    // return if counts have not yet being loaded
    if (state.data.bookingCounts.live === undefined) return state;

    return update.with(state, 'data.bookingCounts', ({ live, future }) => {
      return { live: live + liveModifier, future: future + futureModifier };
    });
  });

  reducer('addInternalMessage', (state, message) => {
    return update.unshift(state, 'data.internalMessages', message);
  });

  reducer('addExternalMessage', (state, message) => {
    return update.unshift(state, 'data.externalMessages', message);
  });

  flightstatsReducers(reducer);
});
