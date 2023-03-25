import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.BoStatistics'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadActiveUsers',
  'loadActiveUsersSuccess',
  'loadActiveUsersError',

  'loadLoginCount',
  'loadLoginCountSuccess',
  'loadLoginCountError'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadActiveUsers = ({ from, to, period }) => ({
  type: TYPES.loadActiveUsers,
  from,
  to,
  period
})

export const loadActiveUsersSuccess = ({ entries }) => ({
  type: TYPES.loadActiveUsersSuccess,
  entries
})

export const loadActiveUsersError = ({ errors }) => ({
  type: TYPES.loadActiveUsersError,
  errors
})

export const loadLoginCount = ({ from, to, period }) => ({
  type: TYPES.loadLoginCount,
  from,
  to,
  period
})

export const loadLoginCountSuccess = ({ entries }) => ({
  type: TYPES.loadLoginCountSuccess,
  entries
})

export const loadLoginCountError = ({ errors }) => ({
  type: TYPES.loadLoginCountError,
  errors
})
