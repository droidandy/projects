import { message } from 'type';

const initialState = {
  collection: [],
  text: '',
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case message.MESSAGE_SEND: {
      return { ...state, collection: payload, text: '' };
    }
    case message.MESSAGE_TEXT_FLUSH: {
      return { ...state, text: '' };
    }
    case message.MESSAGE_EDIT: {
      return { ...state, ...payload };
    }
    case message.MESSAGE_COLLECTION_LOAD_SUCCESS: {
      return { ...state, collection: payload.messages };
    }
    default: {
      return state;
    }
  }
};
