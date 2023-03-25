import { createTypes } from 'redux-compose-reducer';
import { Answers } from 'react-native-fabric';
import { session, user } from 'api';
import faye from 'utils/faye';
import { registerToken } from 'actions/app/pushNotifications';
import { clearPassenger } from 'actions/passenger';
import { clearMap, cancelDriverSubscription } from 'actions/ui/map';
import { clearWeather } from 'actions/ui/weather';
import { clearNavigation } from 'actions/ui/navigation';
import { clearOrdersList } from 'actions/orders';
import { clearBooking } from 'actions/booking';
import { clearPermissions } from 'actions/app/statuses';
import { getNotifications } from 'actions/notifications';

const TYPES = createTypes('session', [
  'loginSuccess',
  'getCurrentUserStart',
  'getCurrentUserSuccess',
  'getCurrentUserFailure',
  'logout',
  'passGuide',
  'resetGuide',
  'setFutureOrdersUpdates'
]);

let futureOrdersUpdatesSubscription = null;

const removeFutureOrdersUpdatesSubscription = () => faye.cancelSubscription(futureOrdersUpdatesSubscription);

export const getFutureOrdersUpdates = channel => (dispatch) => {
  futureOrdersUpdatesSubscription = faye.on(channel, ({ data }) => {
    dispatch({ type: TYPES.setFutureOrdersUpdates, payload: data });
  });
};

export const logout = () => (dispatch) => {
  dispatch({ type: TYPES.logout });
  dispatch(cancelDriverSubscription());
  dispatch(clearPassenger());
  dispatch(clearMap());
  dispatch(clearOrdersList());
  dispatch(clearBooking());
  dispatch(clearPermissions());
  dispatch(clearNavigation());
  dispatch(clearWeather());
  removeFutureOrdersUpdatesSubscription();
};

export const getCurrentUser = () => (dispatch) => {
  dispatch(({ type: TYPES.getCurrentUserStart }));
  return session.getCurrentUser()
    .then(({ data }) => {
      dispatch(({ type: TYPES.getCurrentUserSuccess, payload: data }));

      if (data?.activeBookingsInfoChannel && !futureOrdersUpdatesSubscription) {
        dispatch(getFutureOrdersUpdates(data.activeBookingsInfoChannel));
      }
      dispatch(registerToken());
      return data;
    })
    .catch((err) => {
      dispatch(logout());
      throw err;
    });
};

export const login = user => async (dispatch) => {
  const { data: { token } } = await session.login(user);

  Answers.logLogin('Basic', true);
  dispatch({ type: TYPES.loginSuccess, payload: token });

  dispatch(getNotifications());

  return dispatch(getCurrentUser());
};

export const passGuide = () => dispatch => (
  user.passGuide()
    .then(() => dispatch({ type: TYPES.passGuide }))
);

export const resetGuide = type => ({ type: TYPES.resetGuide, payload: type });
