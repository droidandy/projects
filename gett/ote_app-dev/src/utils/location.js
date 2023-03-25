import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { geocode, processLocation } from './addresses';
import { normalizeCoordinate } from './coordinates';
import { isIOS, isAndroid } from './ui';

export const geoLocationOptions = {
  timeout: 2500,
  distanceFilter: 10,
  enableHighAccuracy: isAndroid
};

class Location {
  // eslint-disable-next-line class-methods-use-this
  getNavigatorLocation(onLoadCoordinate, onGetGeocode, onGeocodeError) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates = { lat: normalizeCoordinate(coords.latitude), lng: normalizeCoordinate(coords.longitude) };

        geocode(coordinates)
          .then(processLocation)
          .then(data => onGetGeocode(data, { type: 'pickupAddress' }))
          .catch(onGeocodeError);

        onLoadCoordinate(coords);
      },
      onGeocodeError,
      { timeout: geoLocationOptions.timeout }
    );
  }

  // eslint-disable-next-line class-methods-use-this
  isGPSEnabled() {
    if (isIOS) return Promise.resolve(true);

    return LocationServicesDialogBox.checkLocationServicesIsEnabled({
      showDialog: false,
      openLocationServices: false,
      preventOutSideTouch: false,
      preventBackClick: false
    })
      .then(() => true)
      .catch(error => error.message !== 'disabled');
  }
}

export default new Location();
