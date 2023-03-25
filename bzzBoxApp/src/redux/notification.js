/**
 * Created by konstantin on 16.08.16.
 */
const TYPES = {
  GET_PUSH: 'GET_PUSH',
  GET_NAME_ROUTE: 'GET_NAME_ROUTE'
};

export const getPush = push => ({
  type: TYPES.GET_PUSH,
  push
});

export const getNameRoute = push => ({
  type: TYPES.GET_NAME_ROUTE,
  push
});

export default (_state = {}, action = {}) => {
  let state = { ..._state };
  switch (action.type) {
    case TYPES.GET_PUSH:
      state.message = action.push.message;
      state.title = action.push.my_title;
      state.active = action.push.active;
      return state;
    case TYPES.GET_NAME_ROUTE:
      state.nameRoute = action.push.nameRoute;
      return state;
    default:
      return state;
  }
};
