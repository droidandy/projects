const TYPE = {
  SELECT_CONVERSATION: 'SELECT_CONVERSATION'
};

export let selectConversation = (id) => ({
  type: TYPE.SELECT_CONVERSATION,
  id
});

export default (state = null, action = {}) => {
  switch (action.type) {
    case TYPE.SELECT_CONVERSATION:
      return action.id;
    default:
      return state;
  }
};

