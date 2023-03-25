export const showStickyMessage = (state, { message }) => ({
  ...state,
  stickyMessages: [ ...state.stickyMessages, message ]
})
