import { namespace } from 'js/redux';
import { get, post, put } from 'utils';

export default namespace('users', (dispatcher, action) => {
  dispatcher('getUsers', (dispatch) => {
    return get('/members')
      .then((res) => {
        dispatch(action('getUsersSuccess', res.data));
      });
  });

  dispatcher('saveUser', (dispatch, user) => {
    if (!user.id) {
      return post('/members', { member: user });
    }

    return put(`/members/${user.id}`, { member: user })
      .then((res) => {
        dispatch(action('updateUserSuccess', res.data));
      });
  });
});
