import { messenger } from 'api';

/**
 * @param message Object
 * @param myUserId int
 * @returns int
 */
const isMessageReadByMe = (message, myUserId) => {
  let readAt = 0;

  message.readers.forEach((reader) => {
    if (reader.user.id === myUserId) {
      readAt = reader.timestamp;
    }
  });

  return readAt;
};

/**
 * @param message Object
 * @returns Promise<Object>
 */
const readMessage = message => (dispatch, getState) => {
  const myUserId = getState().user?.me?.id;
  if (isMessageReadByMe(message, myUserId) || message?.mocked) {
    return;
  }
  messenger.readMessage(message?.id).then(() => console.log('readMessage', message));
};

export default readMessage;
