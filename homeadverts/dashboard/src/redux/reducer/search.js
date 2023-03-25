import { search } from 'type';

const initialState = {
  collection: {
    user: {
      items: [],
      total: 0,
    },
    business: {
      items: [],
      total: 0,
    },
  },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case search.USER_SEARCH: {
      return { ...state, collection: payload };
    }
    case search.USER_SEARCH_CLEAR: {
      return { ...state, collection: initialState.collection };
    }
    default: {
      return state;
    }
  }
};
