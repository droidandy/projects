import { namespace } from 'js/redux';
import { get, post, put, destroy } from 'utils';

export default namespace('passengers', (dispatcher, action) => {
  dispatcher('getPassengers', (dispatch, query) => {
    dispatch(action('setQuery', query));

    return get('/passengers', query)
      .then((res) => {
        dispatch(action('getPassengersSuccess', res.data));
      });
  });

  dispatcher('getStats', (dispatch, id) => {
    dispatch(action('getStats'));

    return get(`/passengers/${id}/stats`)
      .then((res) => {
        dispatch(action('getStatsSuccess', res.data));
      });
  });

  dispatcher('getFormData', (dispatch, passengerId) => {
    const path = passengerId ? `/passengers/${passengerId}/edit` : '/passengers/new';

    return get(path)
      .then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { passenger, ...data } = res.data;

        dispatch(action('getFormDataSuccess', data));
        return res.data;
      });
  });

  dispatcher('savePassenger', (dispatch, passenger) => {
    if (!passenger.id) {
      return post('/passengers', { passenger });
    }

    return put(`/passengers/${passenger.id}`, { passenger });
  });

  dispatcher('importPassengers', (dispatch, data) => {
    return post('passengers/import', data);
  });

  dispatcher('saveFavoriteAddress', (dispatch, passengerId, favoriteAddress) => {
    const passengerAddress = { ...favoriteAddress, type: 'favorite' };

    if (favoriteAddress.id) {
      return put(`/passengers/${passengerId}/addresses/${favoriteAddress.id}`, { passengerAddress })
        .then(({ data }) => dispatch(action('updateFavoriteAddressSuccess', data)));
    }

    return post(`/passengers/${passengerId}/addresses`, { passengerAddress })
      .then(({ data }) => dispatch(action('createFavoriteAddressSuccess', data)));
  });

  dispatcher('destroyFavoriteAddress', (dispatch, passengerId, favoriteAddressId) => {
    return destroy(`/passengers/${passengerId}/addresses/${favoriteAddressId}`)
      .then(() => dispatch(action('destroyFavoriteAddressSuccess', favoriteAddressId)));
  });

  dispatcher('createPaymentCard', (dispatch, passengerId, paymentCard) => {
    dispatch(action('createPaymentCard'));

    return post(`/passengers/${passengerId}/payment_cards`, { paymentCard })
      .then(({ data }) => dispatch(action('createPaymentCardSuccess', data)))
      .catch((err) => {
        dispatch(action('createPaymentCardFailure'));

        return Promise.reject(err.response.data);
      });
  });

  dispatcher('makeDefaultPaymentCard', (dispatch, passengerId, paymentCardId) => {
    return put(`/passengers/${passengerId}/payment_cards/${paymentCardId}/make_default`)
      .then(() => dispatch(action('makeDefaultPaymentCardSuccess', paymentCardId)));
  });

  dispatcher('destroyPaymentCard', (dispatch, passengerId, paymentCardId) => {
    return destroy(`/passengers/${passengerId}/payment_cards/${paymentCardId}`)
      .then(() => dispatch(action('destroyPaymentCardSuccess', paymentCardId)));
  });

  dispatcher('getLog', (dispatch, query) => {
    return get(`/passengers/${query.id}/log`)
      .then((res) => {
        dispatch(action('getLogSuccess', res.data));
      });
  });

  dispatcher('inviteAll', (dispatch) => {
    return put('/members/invite')
      .then((res) => {
        dispatch(action('inviteAllSuccess', res.data));
        return res.data;
      });
  });

  dispatcher('toggleCurrentMemberPassenger', (dispatch, id) => {
    return put(`/passengers/${id}/toggle_booker`)
      .then((res) => {
        dispatch(action('toggleCurrentMemberPassengerSuccess', res.data));

        return res.data;
      });
  });
});
