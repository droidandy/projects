export const showSystemMessage = (state, { message }) => ({
  ...state,
  systemMessages: {
    ...state.systemMessages,
    [message['kind']]: message
  }
})
