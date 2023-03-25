import { Reducer } from 'redux';
import { Flash } from 'types/Flash';
import { initialState } from 'store/initial-state';
import { ADD_FLASH_MESSAGE, REMOVE_FLASH_MESSAGE, FlashMessagesActions } from './types';

const flashMessagesReducer: Reducer<Flash[], FlashMessagesActions> = (state = initialState.flashMessages, action) => {
  switch (action.type) {
    case ADD_FLASH_MESSAGE:
      return [...state, action.payload];
    case REMOVE_FLASH_MESSAGE:
      return [...state].filter((message) => message.id !== action.payload);
    default:
      return state;
  }
};

export { flashMessagesReducer };
