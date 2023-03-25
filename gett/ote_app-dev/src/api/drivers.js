import { get } from 'utils';

const getLocationOfNearbyDrivers = location => get('/drivers/locations', location);

const getDriversChannel = location => get('/drivers/channel', location);

export default {
  getLocationOfNearbyDrivers,
  getDriversChannel
};
