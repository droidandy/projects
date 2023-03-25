import { reduce } from 'js/redux';

const initialState = {
  email: '',
  bookingUpdatesChannel: null,
  layout: {},
  can: {}
};

export default reduce('session', initialState, (reducer) => {
  reducer('getCurrentSuccess', (state, data) => {
    return { ...state, ...data };
  });
});
