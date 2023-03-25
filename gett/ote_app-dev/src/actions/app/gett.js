import { createTypes } from 'redux-compose-reducer';
import { find, isEmpty } from 'lodash';
import { GA } from 'api';
import { prepareFullyProperties } from 'utils';

const TYPES = createTypes('app/gett', [
  'getAccessTokenSuccess'
]);

export const postEvent = (eventName = '', properties = {}) => (_, getState) => {
  const {
    booking: { formData: { passenger, passengers, travelReasons }, bookingForm, vehiclesData, currentOrder },
    passenger: { data: { passenger: passengerData, favoriteAddresses, paymentCards } },
    ui: { map: { currentPosition } },
    app: { statuses: { permissions } },
    session
  } = getState();

  const memberId = session.user?.memberId;
  const order = currentOrder.id ? currentOrder : bookingForm;
  const currentPassenger = (!isEmpty(passengerData) && { ...passengerData, favoriteAddresses, paymentCards }) ||
    passenger ||
    find(passengers, { id: +bookingForm.passengerId });

  const deviceProperties = {
    ...currentPosition,
    ...permissions
  };

  GA.postEvent(eventName, {
    ...prepareFullyProperties({ order, vehiclesData, memberId, currentPassenger, deviceProperties, travelReasons }),
    ...properties
  });
};

export const getAccessToken = () => dispatch => (
  GA.getAccessToken()
    .then(({ data }) => {
      dispatch(({ type: TYPES.getAccessTokenSuccess, payload: data }));
      dispatch(postEvent('app_launch'));
    })
);
