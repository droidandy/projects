import { reduce } from 'js/redux';
import update from 'update-js';
import { flightstatsReducers } from 'utils/flightstats';

const initialState = {
  data: {
    chartData: {
      name: '',
      completedOrders: {}
    },
    orderCounts: {},
    ordersCount: 0,
    internalMessages: [],
    externalMessages: [],
    can: {}
  },
  flight: {
    schedule: false
  }
};

export default reduce('dashboard', initialState, (reducer) => {
  reducer('getDashboardSuccess', (state, data) => {
    return { ...state, data };
  });
  
  reducer('updateOrdersCounts', (state, liveModifier, futureModifier) => {
    // return if counts have not yet being loaded
    if (state.data.ordersCounts.live === undefined) return state;
    
    return update.with(state, 'data.ordersCounts', ({ live, future }) => {
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
