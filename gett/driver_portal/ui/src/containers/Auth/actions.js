import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.Auth'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'auth',

  'login',
  'loginSuccess',
  'loginFail',

  'resetPassword',
  'resetPasswordSuccess',
  'resetPasswordFail',

  'setupPassword',
  'setupPasswordSuccess',
  'setupPasswordFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const login = ({ email, password }) => ({
  type: TYPES.login,
  email,
  password
})

export const auth = ({ token }) => ({
  type: TYPES.auth,
  token
})

export const loginSuccess = () => ({
  type: TYPES.loginSuccess
})

export const loginFail = ({ errors }) => ({
  type: TYPES.loginFail,
  errors
})

export const resetPassword = ({ email }) => ({
  type: TYPES.resetPassword,
  email
})

export const resetPasswordSuccess = () => ({
  type: TYPES.resetPasswordSuccess
})

export const resetPasswordFail = ({ errors }) => ({
  type: TYPES.resetPasswordFail,
  errors
})

export const setupPassword = ({ token, password, passwordConfirmation }) => ({
  type: TYPES.setupPassword,
  token,
  password,
  passwordConfirmation
})

export const setupPasswordSuccess = () => ({
  type: TYPES.setupPasswordSuccess
})

export const setupPasswordFail = ({ errors }) => ({
  type: TYPES.setupPasswordFail,
  errors
})
