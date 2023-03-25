import { namespace } from 'js/redux';
import { get, post, put } from 'utils';

export default namespace('users', (dispatcher, action) => {
  dispatcher('getUsers', (dispatch, query) => {
    dispatch(action('setQuery', query));

    return get('/admin/users', query)
      .then((res) => {
        dispatch(action('getUsersSuccess', res.data));
      });
  });

  dispatcher('getFormData', (dispatch, userId) => {
    const path = userId ? `/admin/users/${userId}/edit` : '/admin/users/new';

    return get(path)
      .then((res) => {
        dispatch(action('getFormDataSuccess', res.data));
        return res.data;
      });
  });

  dispatcher('saveUser', (dispatch, user) => {
    if (!user.id) {
      return post('/admin/users', { user });
    }

    return put(`/admin/users/${user.id}`, { user });
  });
});
