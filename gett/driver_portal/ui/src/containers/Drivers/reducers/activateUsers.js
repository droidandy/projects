import { keyBy } from 'lodash'

export const activateUsers = (state) => ({
  ...state,
  loading: true
})

export const activateUsersSuccess = (state, { succeededUsers, skippedUsers, failedUsers }) => ({
  ...state,
  loading: false,
  users: {
    ...state.users,
    ...keyBy(succeededUsers, 'id'),
    ...keyBy(skippedUsers, 'id'),
    ...keyBy(failedUsers, 'id')
  }
})

export const activateUsersFail = (state) => ({
  ...state,
  loading: false
})
