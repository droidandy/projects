import { keyBy } from 'lodash'

export const inviteUsers = (state) => ({
  ...state,
  loading: true
})

export const inviteUsersSuccess = (state, { succeededUsers, skippedUsers, failedUsers }) => ({
  ...state,
  loading: false,
  users: {
    ...state.users,
    ...keyBy(succeededUsers, 'id'),
    ...keyBy(skippedUsers, 'id'),
    ...keyBy(failedUsers, 'id')
  }
})

export const inviteUsersFail = (state) => ({
  ...state,
  loading: false
})
