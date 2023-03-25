import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.SignUp'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'signUp',
  'signUpSuccess',
  'signUpFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const signUp = ({ user }) => ({
  type: TYPES.signUp,
  user
})

export const signUpSuccess = () => ({
  type: TYPES.signUpSuccess
})

export const signUpFail = ({ errors }) => ({
  type: TYPES.signUpFail,
  errors
})
