import { keyBy } from 'lodash'

export const deactivateUsers = (state) => ({
  ...state,
  loading: true
})

export const deactivateUsersSuccess = (state, { succeededUsers, skippedUsers, failedUsers }) => ({
  ...state,
  loading: false,
  users: {
    ...state.users,
    ...keyBy(succeededUsers, 'id'),
    ...keyBy(skippedUsers, 'id'),
    ...keyBy(failedUsers, 'id')
  }
})

export const deactivateUsersFail = (state) => ({
  ...state,
  loading: false
})
