import { createTypes } from 'redux-compose-reducer';
import DeviceInfo from 'react-native-device-info';

import { userDevices } from 'api';
import PN from 'utils/notifications';

const TYPES = createTypes('app/push', [
  'saveToken',
  'registerToken',
  'deleteToken'
]);

const deviceProperties = {
  uuid: DeviceInfo.getUniqueID(),
  deviceType: DeviceInfo.getSystemName(),
  osType: `${DeviceInfo.getBrand()}, ${DeviceInfo.getDeviceId()}`,
  clientOsVersion: DeviceInfo.getSystemVersion(),
  deviceNetworkProvider: DeviceInfo.getCarrier()
};

export const saveToken = token => (dispatch) => {
  dispatch({ type: TYPES.saveToken, payload: { token } });
};

export const registerToken = () => (dispatch, getState) => {
  const token = getState().app.push.token;

  if (!token) {
    PN.registerFCMToken().then((deviceToken) => {
      userDevices.bindUserDevice({ deviceToken, ...deviceProperties });
    });
  } else {
    userDevices.bindUserDevice({ deviceToken: token, ...deviceProperties });
  }
};

export const deleteToken = () => (dispatch, getState) => {
  const token = getState().app.push.token;

  return userDevices.removeUserDevice({ deviceToken: token });
};
