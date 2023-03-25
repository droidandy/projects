import { keyBy } from 'lodash'

export const loadUsers = (state) => ({
  ...state,
  loading: true
})

export const loadUsersSuccess = (state, { users, total, lastSyncAt }) => ({
  ...state,
  loading: false,
  users: keyBy(users, 'id'),
  total,
  lastSyncAt
})

export const loadUsersFail = (state) => ({
  ...state,
  loading: false
})
