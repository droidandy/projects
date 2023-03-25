import { createTypes } from 'redux-compose-reducer';
import { drivers, user } from 'api';
import faye from 'utils/faye';

const TYPES = createTypes('ui/map', [
  'changePosition',
  'setDrivers',
  'clearMap',
  'changeRegionToAnimate',
  'changeCoordinatesToResize',
  'clearCoordinates'
]);

export const changePosition = obq => ({ type: TYPES.changePosition, payload: obq });

export const clearMap = () => ({ type: TYPES.clearMap });

let driversSubscription = null;

const subscribeToChannel = channel => (dispatch) => {
  driversSubscription = faye.on((channel), ({ data }) => {
    if (data.drivers.length) dispatch({ type: TYPES.setDrivers, payload: data });
  });
};

export const subscribeToDriversLocations = location => dispatch => (
  drivers.getDriversChannel(location)
    .then(({ data }) => {
      // eslint-disable-next-line no-underscore-dangle
      if (driversSubscription && driversSubscription._channels.replace('/', '') === data.channel) return;

      faye.cancelSubscription(driversSubscription);
      dispatch(subscribeToChannel(data.channel));
    })
);

export const cancelDriverSubscription = () => () => {
  faye.cancelSubscription(driversSubscription);
};

export const getDriversLocations = location => dispatch => (
  drivers.getLocationOfNearbyDrivers(location)
    .then(({ data }) => {
      dispatch({ type: TYPES.setDrivers, payload: data });
    })
);

export const changeRegionToAnimate = region => ({ type: TYPES.changeRegionToAnimate, payload: region });

export const changeCoordinatesToResize = coordinates => (
  { type: TYPES.changeCoordinatesToResize, payload: coordinates }
);

export const clearCoordinates = () => ({ type: TYPES.clearCoordinates });

export const trackUserLocation = () => (_, getState) => {
  const { ui: { map: { currentPosition } } } = getState();

  return user.trackUserLocation({
    lat: currentPosition?.latitude,
    lng: currentPosition?.longitude
  });
};
