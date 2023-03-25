import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  active: [],
  completed: [],
  future: [],
  loadingOrders: false,
  pathPoints: {},
  drivers: [],
  driversFilter: 7
};

const ALLOWED_STATUSES = [2, 3, 4, 5];

function filterDrivers(driver) {
  return driver.latitude && driver.longitude && ALLOWED_STATUSES.includes(driver.statusId);
}

export default reduce('orders', initialState, (reducer) => {
  reducer('getOrders', (state) => {
    return update(state, 'loadingOrders', true);
  });

  reducer('getOrdersSuccess', (state, type, data) => {
    return update(state, { [type]: data.reverse(), 'loadingOrders': false });
  });

  reducer('getOrderPathPointsSuccess', (state, { orderId, pathPoints }) => {
    return update.assign(state, 'pathPoints', { [orderId]: pathPoints });
  });

  reducer('getDriversSuccess', (state, data) => {
    return update(state, 'drivers', data.filter(filterDrivers));
  });

  reducer('changeDriversFilter', (state, value) => {
    return update(state, 'driversFilter', state.driversFilter ^ value);
  });
});
