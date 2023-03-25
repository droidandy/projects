import { filter } from 'lodash'

export const hideStickyMessage = (state, { message }) => ({
  ...state,
  stickyMessages: filter(state.stickyMessages, m => m.uuid !== message.uuid)
})
