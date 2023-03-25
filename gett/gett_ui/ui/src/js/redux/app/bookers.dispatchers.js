import { namespace } from 'js/redux';
import { get, post, put, destroy } from 'utils';

export default namespace('bookers', (dispatcher, action) => {
  dispatcher('getBookers', (dispatch, query) => {
    dispatch(action('setQuery', query));

    return get('/bookers', query)
      .then((res) => {
        dispatch(action('getBookersSuccess', res.data));
      });
  });

  dispatcher('getDetails', (dispatch, id) => {
    dispatch(action('getDetails'));

    return get(`/bookers/${id}`)
      .then((res) => {
        dispatch(action('getDetailsSuccess', res.data));
      });
  });

  dispatcher('getFormData', (dispatch, bookerId) => {
    const path = bookerId ? `/bookers/${bookerId}/edit` : '/bookers/new';

    return get(path)
      .then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { booker, ...data } = res.data;

        dispatch(action('getFormDataSuccess', data));
        return res.data;
      });
  });

  dispatcher('saveBooker', (dispatch, booker) => {
    if (!booker.id) {
      return post('/bookers', { booker });
    }

    return put(`/bookers/${booker.id}`, { booker })
      .then((res) => {
        dispatch(action('updateBookerSuccess', res.data));
      });
  });

  dispatcher('destroyBooker', (dispatch, id) => {
    return destroy(`/bookers/${id}`)
      .then(() => dispatch(action('destroyBookerSuccess', id)));
  });

  dispatcher('getLog', (dispatch, query) => {
    return get(`/bookers/${query.id}/log`)
      .then((res) => {
        dispatch(action('getLogSuccess', res.data));
      });
  });

  dispatcher('toggleCurrentMemberBooker', (dispatch, id) => {
    return put(`/bookers/${id}/toggle_passenger`)
      .then((res) => {
        dispatch(action('toggleCurrentMemberBookerSuccess', res.data));

        return res.data;
      });
  });
});
