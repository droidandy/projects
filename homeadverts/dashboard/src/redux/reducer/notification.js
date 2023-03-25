import { notification } from 'type';

const initialState = {
  text: '',
  open: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case notification.NOTIFICATION_SHOW: {
      return { ...state, text: payload, open: true };
    }
    case notification.NOTIFICATION_HIDE: {
      return { ...state, open: false };
    }
    default: {
      return state;
    }
  }
};
