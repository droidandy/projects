export const updateUser = (state) => ({
  ...state,
  update: {
    ...state.update,
    loading: true
  },
  show: true
})

export const updateUserSuccess = (state, { user }) => {
  return {
    ...state,
    users: {
      ...state.users,
      [user.id]: user
    },
    update: {
      ...state.update,
      loading: false
    },
    show: false
  }
}

export const updateUserFail = (state, { errors }) => ({
  ...state,
  update: {
    ...state.update,
    errors,
    loading: false
  },
  show: true
})
