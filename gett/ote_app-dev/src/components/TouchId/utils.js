import TouchID from 'react-native-touch-id';
import { setTouchIdStatus } from 'actions/app/statuses';
import { color } from 'theme';

export const checkTouchIdSupport = () => (dispatch, getState) => (
  TouchID.isSupported()
    .then((biometryType) => {
      let nextValue = getState().app.statuses.touchIdStatus;
      if (biometryType === 'TouchID' || biometryType === true) {
        nextValue |= 4;
      } else if (biometryType === 'FaceID') {
        nextValue |= 2;
      }
      dispatch(setTouchIdStatus(nextValue));
    })
    .catch(() => {
      dispatch(setTouchIdStatus(0));
    })
);

const optionalConfigObject = {
  title: 'Log in to "Gett Busines"', // Android
  imageColor: color.primaryBtns, // Android
  imageErrorColor: color.danger, // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: '', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false // iOS
};

export const touchIdAuthenticate = () => (
  TouchID.authenticate('Log in with your Touch ID', optionalConfigObject)
);
