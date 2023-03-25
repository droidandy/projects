import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.BoUsers'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadUsers',
  'loadUsersSuccess',
  'loadUsersFail',

  'activateUser',
  'activateUserSuccess',
  'activateUserFail',

  'deactivateUser',
  'deactivateUserSuccess',
  'deactivateUserFail',

  'inviteUser',
  'inviteUserSuccess',
  'inviteUserFail',

  'updateUser',
  'updateUserSuccess',
  'updateUserFail',

  'createUser',
  'createUserSuccess',
  'createUserFail'

])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadUsers = ({ page, perPage, query }) => ({
  type: TYPES.loadUsers,
  page,
  perPage,
  query
})

export const loadUsersSuccess = ({ users, total, lastSyncAt }) => ({
  type: TYPES.loadUsersSuccess,
  users,
  total,
  lastSyncAt
})

export const loadUsersFail = () => ({
  type: TYPES.loadUsersFail
})

export const activateUser = ({ user }) => ({
  type: TYPES.activateUser,
  user
})

export const activateUserSuccess = ({ user }) => ({
  type: TYPES.activateUserSuccess,
  user
})

export const activateUserFail = () => ({
  type: TYPES.activateUserFail
})

export const deactivateUser = ({ user }) => ({
  type: TYPES.deactivateUser,
  user
})

export const deactivateUserSuccess = ({ user }) => ({
  type: TYPES.deactivateUserSuccess,
  user
})

export const deactivateUserFail = () => ({
  type: TYPES.deactivateUserFail
})

export const inviteUser = ({ user }) => ({
  type: TYPES.inviteUser,
  user
})

export const inviteUserSuccess = ({ user }) => ({
  type: TYPES.inviteUserSuccess,
  user
})

export const inviteUserFail = () => ({
  type: TYPES.inviteUserFail
})

export const updateUser = ({ user }) => ({
  type: TYPES.updateUser,
  user
})

export const updateUserSuccess = ({ user }) => ({
  type: TYPES.updateUserSuccess,
  user
})

export const updateUserFail = ({ errors }) => ({
  type: TYPES.updateUserFail,
  errors
})

export const createUser = ({ user }) => ({
  type: TYPES.createUser,
  user
})

export const createUserSuccess = ({ user }) => ({
  type: TYPES.createUserSuccess,
  user
})

export const createUserFail = ({ errors }) => ({
  type: TYPES.createUserFail,
  errors
})
