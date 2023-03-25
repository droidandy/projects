import { story } from 'type';

const initialState = {
  collection: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case story.STORY_COLLECTION_LOAD: {
      return { ...state, collection: payload };
    }
    default: {
      return state;
    }
  }
};
