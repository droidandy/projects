import { room } from 'type';

const initialState = {
  allCollection: [],
  collection: [],
  search: '',
  selected: null,
  details: {},
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case room.ROOM_SELECT: {
      return { ...state, selected: payload };
    }
    case room.ROOM_UNSELECT: {
      return { ...state, selected: null };
    }
    case room.ROOM_SEARCH: {
      const match = o => o?.name?.toLowerCase()?.match(payload?.toLowerCase());
      return {
        ...state,
        collection: state.allCollection.filter(match),
        search: payload,
      };
    }
    case room.ROOM_ONLINE_UPDATE: {
      return { ...state, collection: payload };
    }
    case room.ROOM_COLLECTION_LOAD_SUCCESS: {
      return { ...state, ...payload, allCollection: payload?.collection };
    }
    case room.ROOM_DETAILS_LOAD_SUCCESS: {
      return { ...state, details: payload };
    }
    case room.UPDATE_ROOM_DETAILS: {
      return { ...state, details: { ...state.details, ...payload } };
    }
    default: {
      return state;
    }
  }
};
