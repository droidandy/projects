import { Flash } from 'types/Flash';
import { ADD_FLASH_MESSAGE, AddFlashMessageAction, REMOVE_FLASH_MESSAGE, RemoveFlashMessageAction } from './types';

const addFlashMessage = (message: Flash): AddFlashMessageAction => {
  return {
    type: ADD_FLASH_MESSAGE,
    payload: message,
  };
};

const removeFlashMessage = (id: string): RemoveFlashMessageAction => {
  return {
    type: REMOVE_FLASH_MESSAGE,
    payload: id,
  };
};

export { addFlashMessage, removeFlashMessage };
