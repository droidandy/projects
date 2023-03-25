import Config from 'react-native-config';
import { chunk, flatten, last, noop } from 'lodash';

import { getStops } from 'utils';

export const normalizeCoordinate = coord => +parseFloat(coord).toFixed(12);

export const prepareCoordinates = address => (
  address && address.lat && address.lng
    ? { latitude: address.lat, longitude: address.lng }
    : address
);

const getHundredRoute = (coords = []) => {
  const route = coords.reduce((accumulator, item) => {
    const preparedCoords = prepareCoordinates(item);

    return `${accumulator}${preparedCoords.latitude},${preparedCoords.longitude}|`;
  }, '');

  const path = `path=${route.slice(0, -1)}`;
  const key = `key=${Config.GOOGLE_API_KEY}`;

  return fetch(`https://roads.googleapis.com/v1/snapToRoads?${path}&${key}&interpolate=true`)
    .then(response => response.json())
    .then(data => data.snappedPoints.map(item => item.location))
    .catch(noop);
};

export const getOptimisedRoute = async (driverPath) => {
  const limitedCoords = 99;
  const resultPath = chunk(driverPath, limitedCoords).map((hundredPath, index, arr) => (
    getHundredRoute(index ? [last(arr[index - 1]), ...hundredPath] : hundredPath)
  ));

  return flatten(await Promise.all(resultPath));
};

export const arrayToCoordinates = ([latitude, longitude]) => ({ latitude, longitude });

export const preparePointsListCoordinates = (order) => {
  const source = prepareCoordinates(order.pickupAddress);
  const dest = prepareCoordinates(order.destinationAddress);
  const stops = (getStops(order) ? getStops(order).map(s => s.address || s) : []).map(prepareCoordinates);

  return { source, dest, stops };
};

export const checkCoordinatesDiff = (first, second, type = 'similar', precision) => {
  const maxCoord = Math.max(Math.abs(first.latitude - second.latitude), Math.abs(first.longitude - second.longitude));

  if (type === 'similar') {
    return maxCoord < (precision || 0.000001);
  }

  return maxCoord > (precision || 0.01);
};
