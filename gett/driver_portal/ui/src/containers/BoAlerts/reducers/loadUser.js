export const loadUser = (state) => ({
  ...state,
  user: {
    ...state.user,
    loading: true
  }
})

export const loadUserSuccess = (state, { user }) => ({
  ...state,
  user: {
    ...user,
    loading: false
  }
})

export const loadUserFail = (state) => ({
  ...state,
  user: {
    ...state.user,
    loading: false
  }
})
