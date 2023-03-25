import { message } from 'type';

export const messageSendAction = payload => ({ type: message.MESSAGE_SEND, payload });

export const messageEditAction = payload => ({ type: message.MESSAGE_EDIT, payload });

export const messageTextFlushAction = () => ({ type: message.MESSAGE_TEXT_FLUSH });

export const messageCollectionLoadSuccessAction = payload => ({
  type: message.MESSAGE_COLLECTION_LOAD_SUCCESS,
  payload,
});
