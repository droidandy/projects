import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.Drivers'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadUsers',
  'loadUsersSuccess',
  'loadUsersFail',

  'synchronizeUsers',
  'synchronizeUsersSuccess',
  'synchronizeUsersFail',

  'activateUser',
  'activateUserSuccess',
  'activateUserFail',

  'activateUsers',
  'activateUsersSuccess',
  'activateUsersFail',

  'deactivateUser',
  'deactivateUserSuccess',
  'deactivateUserFail',

  'deactivateUsers',
  'deactivateUsersSuccess',
  'deactivateUsersFail',

  'inviteUser',
  'inviteUserSuccess',
  'inviteUserFail',

  'inviteUsers',
  'inviteUsersSuccess',
  'inviteUsersFail',

  'loginAsUser',
  'showComplianceView',
  'unclaimUser',
  'startReview'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadUsers = ({ page, perPage, query, category, role }) => ({
  type: TYPES.loadUsers,
  page,
  perPage,
  query,
  category,
  role
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

export const synchronizeUsers = () => ({
  type: TYPES.synchronizeUsers
})

export const synchronizeUsersSuccess = ({ lastSyncAt }) => ({
  type: TYPES.synchronizeUsersSuccess,
  lastSyncAt
})

export const synchronizeUsersFail = () => ({
  type: TYPES.synchronizeUsersFail
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

export const activateUsers = ({ users }) => ({
  type: TYPES.activateUsers,
  users
})

export const activateUsersSuccess = ({ succeededUsers, skippedUsers, failedUsers }) => ({
  type: TYPES.activateUsersSuccess,
  succeededUsers,
  skippedUsers,
  failedUsers
})

export const activateUsersFail = () => ({
  type: TYPES.activateUsersFail
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

export const deactivateUsers = ({ users }) => ({
  type: TYPES.deactivateUsers,
  users
})

export const deactivateUsersSuccess = ({ succeededUsers, skippedUsers, failedUsers }) => ({
  type: TYPES.deactivateUsersSuccess,
  succeededUsers,
  skippedUsers,
  failedUsers
})

export const deactivateUsersFail = () => ({
  type: TYPES.deactivateUsersFail
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

export const inviteUsers = ({ users }) => ({
  type: TYPES.inviteUsers,
  users
})

export const inviteUsersSuccess = ({ succeededUsers, skippedUsers, failedUsers }) => ({
  type: TYPES.inviteUsersSuccess,
  succeededUsers,
  skippedUsers,
  failedUsers
})

export const inviteUsersFail = () => ({
  type: TYPES.inviteUsersFail
})

export const loginAsUser = ({ user }) => ({
  type: TYPES.loginAsUser,
  user
})

export const showComplianceView = ({ user, history }) => ({
  type: TYPES.showComplianceView,
  user,
  history
})

export const unclaimUser = ({ user }) => ({
  type: TYPES.unclaimUser,
  user
})

export const startReview = ({ user, history }) => ({
  type: TYPES.startReview,
  user,
  history
})
