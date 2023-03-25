import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.ContactUs'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'send',
  'sended',
  'failed'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const sendMessage = ({ message }) => ({
  type: TYPES.send,
  message
})

export const sendMessageSuccess = () => ({
  type: TYPES.sended
})

export const sendMessageFailed = () => ({
  type: TYPES.failed
})
