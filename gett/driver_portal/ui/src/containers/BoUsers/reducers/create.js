import { keyBy } from 'lodash'

export const createUser = (state) => ({
  ...state,
  create: {
    ...state.create,
    loading: true
  },
  show: true
})

export const createUserSuccess = (state, { user }) => {
  return {
    ...state,
    users: keyBy({ ...state.users, user }, 'id'),
    create: {
      ...state.create,
      loading: false
    },
    show: false
  }
}

export const createUserFail = (state, { errors }) => ({
  ...state,
  create: {
    ...state.create,
    errors,
    loading: false,
    show: true
  }
})
