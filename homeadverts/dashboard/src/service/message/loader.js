import { messageCollectionLoadSuccessAction, messageSendAction } from 'action/message';
import { messenger } from 'api';

const welcomeMessage = (room, myUser) => {
  const text = 'Hi, I\'m online...';

  return [{
    mocked: true,
    id: Math.random(),
    timestamp: Date.now(),
    text,
    user: room.admin,
    readers: [
      {
        user: room.admin,
      },
      {
        user: myUser,
      },
    ],
  }];
};

const formatMessages = (messages, myUserId) => {
  const formatted = [];

  for (let i = 0; i < messages.length; i += 1) {
    const m = messages[i];
    const previous = messages[i - 1];
    const next = messages[i + 1];

    m.classes = '';
    m.isFirst = false;
    m.my = myUserId?.id === messages[i].user.id;

    if (i === 0) {
      m.classes += '__initial';
      m.isFirst = true;
    }

    if (previous) {
      if (previous.user.id !== m.user.id) {
        m.isFirst = true;
        m.classes += '__first';
      }
    }
    if (previous && !next) {
      m.classes += '__last';
    }
    if (next) {
      if (next.user.id !== m.user.id) {
        m.classes += '__last';
      }
    }

    formatted.push(m);
  }

  return formatted;
};

export const updateMockedMessage = mock => (dispatch, getState) => {
  let messages = getState().message.collection;

  messages = messages.map((message) => {
    if (message.id === mock.id) {
      message.mocked = false;
    }

    return message;
  });

  // Dispatch event
  dispatch(messageSendAction(messages));
};

export const insertMockToMessages = message => (dispatch, getState) => {
  const messages = getState().message.collection;

  messages.push(message);

  const formatted = formatMessages(messages, getState().user.me);

  // Dispatch event
  dispatch(messageSendAction(formatted));
};

export const loadMessages = room => (dispatch, getState) => {
  messenger.loadMessages(room?.id)
    .then((res) => {
      let messages = res?.data;

      if (messages?.length === 0) {
        messages = welcomeMessage(room, getState().user.me);
      }

      const formatted = formatMessages(messages, getState().user.me);

      // Dispatch event
      dispatch(messageCollectionLoadSuccessAction({ roomId: room?.id, messages: formatted }));
    });
};

