import { isEqual } from 'lodash';
import { prepareCoordinates } from 'utils';
import { addresses } from 'api';

export const isGBAddress = (address = {}) => (
  address.countryCode === 'GB'
);

export const processLocation = (location) => {
  const {
    lat,
    lng,
    postalCode,
    name,
    formattedAddress,
    countryCode,
    timezone,
    city,
    placeId,
    airport,
    region
  } = location;

  const processedLocation = {
    lat,
    lng,
    postalCode,
    countryCode,
    line: name && !formattedAddress.includes(name) ? [name, formattedAddress].join(', ') : formattedAddress,
    timezone,
    city,
    placeId,
    airport,
    region
  };

  if (
    !processedLocation.line ||
    !lat ||
    !lng ||
    (!postalCode && isGBAddress(processedLocation))
  ) {
    throw new Error(processedLocation.line);
  }
  return processedLocation;
};

export function geocode(params) {
  return addresses.geocode(params)
    .then((res) => {
      if (!res.data.countryCode) throw new Error(res.data.line);

      return res.data;
    });
}

export const areAddressesEqual = (first, second) => {
  const firstCoordinate = prepareCoordinates(first);
  const secondCoordinate = prepareCoordinates(second);
  return isEqual(firstCoordinate, secondCoordinate);
};

export function nullAddress(line = null) {
  return {
    line,
    lat: null,
    lng: null,
    postalCode: null,
    timezone: 'Europe/London'
  };
}
