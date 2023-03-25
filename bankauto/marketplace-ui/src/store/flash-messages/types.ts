import { Flash } from 'types/Flash';
export const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE';
export const REMOVE_FLASH_MESSAGE = 'REMOVE_FLASH_MESSAGE';

export interface AddFlashMessageAction {
  type: typeof ADD_FLASH_MESSAGE;
  payload: Flash;
}
export interface RemoveFlashMessageAction {
  type: typeof REMOVE_FLASH_MESSAGE;
  payload: string;
}

export type FlashMessagesActions = AddFlashMessageAction | RemoveFlashMessageAction;
