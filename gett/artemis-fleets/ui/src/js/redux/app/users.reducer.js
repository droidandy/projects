import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  users: []
};

export default reduce('users', initialState, (reducer) => {
  reducer('getUsersSuccess', (state, data) => {
    return update(state, 'users', data);
  });

  reducer('updateUserSuccess', (state, user) => {
    return update(state, `users.{id:${user.id}}`, user);
  });
});
