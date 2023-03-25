import { messageEditAction } from 'action/message';
import { messenger } from 'api';
import { insertMockToMessages, updateMockedMessage } from './loader';

const mockMessage = (text, user) => {
  return {
    mocked: true,
    id: Math.random(),
    timestamp: Date.now(),
    text,
    user: {
      id: user.id,
    },
    readers: [
      {
        user: {
          id: user.id,
        },
      },
    ],
  };
};

export const sendMessage = () => (dispatch, getState) => {
  const text = getState().message?.text;
  const roomId = getState().room.selected.id;

  if (text.trim().length === 0) {
    return;
  }

  const mock = mockMessage(text, getState().user.me);

  dispatch(insertMockToMessages(mock));
  messenger.sendMessage(roomId, text)
    .then(() => {
      dispatch(updateMockedMessage(mock));
    });
  // .catch((err) => {
  // dispatch(notificationShowAction(err));
  // });
};

export const editText = text => (dispatch, getState) => {
  const { room: { selected } } = getState();
  dispatch(messageEditAction({ roomId: selected?.id, text }));
};
