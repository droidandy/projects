import { user } from 'type';

const initialState = {
  collection: [],
  me: {},
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case user.USER_AUTHORIZE_SUCCESS: {
      return { ...state, me: payload };
    }
    case user.USER_COLLECTION_LOAD: {
      return { ...state, collection: payload };
    }
    default: {
      return state;
    }
  }
};
