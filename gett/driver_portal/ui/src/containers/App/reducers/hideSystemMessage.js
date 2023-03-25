import { omit } from 'lodash'

export const hideSystemMessage = (state, { message }) => ({
  ...state,
  systemMessages: omit(state.systemMessages, message['kind'])
})
