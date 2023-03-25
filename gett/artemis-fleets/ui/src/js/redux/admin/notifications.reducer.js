import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  messages: []
};

export default reduce('notifications', initialState, (reducer) => {
  reducer('getMessagesSuccess', (state, messages) => {
    return { ...state, messages };
  });

  reducer('addMessage', (state, message) => {
    return update.unshift(state, 'messages', message);
  });
});
