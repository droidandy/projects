import { namespace } from 'js/redux';
import { get, post, put, destroy } from 'utils';

export default namespace('members', (dispatcher, action) => {
  dispatcher('getMembers', (dispatch, query) => {
    dispatch(action('setQuery', query));

    return get('/admin/members', query)
      .then((res) => {
        dispatch(action('getMembersSuccess', res.data));
      });
  });

  dispatcher('getStats', (dispatch, id) => {
    dispatch(action('getStats'));

    return get(`/admin/members/${id}/stats`)
      .then((res) => {
        dispatch(action('getStatsSuccess', res.data));
      });
  });

  dispatcher('getFormData', (dispatch, userId) => {
    return get(`/admin/members/${userId}/edit`)
      .then((res) => {
        dispatch(action('getFormDataSuccess', res.data));
        return { ...res.data, user: res.data.booker || res.data.passenger };
      });
  });

  dispatcher('saveUser', (dispatch, user) => {
    return put(`/admin/members/${user.id}`, { user });
  });

  dispatcher('saveFavoriteAddress', (dispatch, passengerId, favoriteAddress) => {
    const passengerAddress = { ...favoriteAddress, type: 'favorite' };

    if (favoriteAddress.id) {
      return put(`/admin/members/${passengerId}/addresses/${favoriteAddress.id}`, { passengerAddress })
        .then(({ data }) => dispatch(action('updateFavoriteAddressSuccess', data)));
    }

    return post(`/admin/members/${passengerId}/addresses`, { passengerAddress })
      .then(({ data }) => dispatch(action('createFavoriteAddressSuccess', data)));
  });

  dispatcher('destroyFavoriteAddress', (dispatch, passengerId, favoriteAddressId) => {
    return destroy(`/admin/members/${passengerId}/addresses/${favoriteAddressId}`)
      .then(() => dispatch(action('destroyFavoriteAddressSuccess', favoriteAddressId)));
  });

  dispatcher('makeDefaultPaymentCard', (dispatch, passengerId, paymentCardId) => {
    return put(`/admin/members/${passengerId}/payment_cards/${paymentCardId}/make_default`)
      .then(() => dispatch(action('makeDefaultPaymentCardSuccess', paymentCardId)));
  });

  dispatcher('destroyPaymentCard', (dispatch, passengerId, paymentCardId) => {
    return destroy(`/admin/members/${passengerId}/payment_cards/${paymentCardId}`)
      .then(() => dispatch(action('destroyPaymentCardSuccess', paymentCardId)));
  });

  dispatcher('savePassword', (dispatch, user) => {
    return put(`/admin/members/${user.id}/update_password`, { user });
  });

  dispatcher('getLog', (dispatch, query) => {
    return get(`/admin/members/${query.id}/log`)
      .then((res) => {
        dispatch(action('getLogSuccess', res.data));
      });
  });

  dispatcher('getComments', (dispatch, userId) => {
    return get(`/admin/members/${userId}/comments`)
      .then(({ data }) => dispatch(action('getCommentsSuccess', data.items)));
  });

  dispatcher('addComment', (dispatch, userId, text) => {
    return post(`/admin/members/${userId}/comments`, { comment: { text } })
      .then(({ data }) => dispatch(action('addComment', data.comment)));
  });
});
