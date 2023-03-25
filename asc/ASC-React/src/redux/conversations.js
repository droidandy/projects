import {v4 as generateId} from 'node-uuid';

const TYPE = {
  ADD_CONVERSATION_WITH_ID: 'ADD_CONVERSATION_WITH_ID',
  ADD_CONVERSATION: 'ADD_CONVERSATION'
};

export let addConversation = (data) => ({
  type: TYPE.ADD_CONVERSATION,
  id: generateId(),
  ...data
});

export let addConversationWithId = (data, id) => {
  console.log('data, id ', data, id);
  data.id = id;
  return {
    type: TYPE.ADD_CONVERSATION_WITH_ID,
    id,
    data
  };
};

const initialState = {
  isFetching: false,
  isInvalid: false
};

const conversation = (state = initialState, action = {}) => {
  switch (action.type) {
    case TYPE.ADD_CONVERSATION:
      return {
        id: action.id,
        ...action,
        ...state
      };
    default:
      return state;
  }
};

export default (state = {}, action = {}) => {
  switch (action.type) {
    case TYPE.ADD_CONVERSATION_WITH_ID:
      return {
        ...state,
        [action.id]: action.data
      };
    case TYPE.ADD_CONVERSATION:
      return {
        ...state,
        [action.id]: conversation(undefined, action)
      };
    default:
      return state;
  }
};
