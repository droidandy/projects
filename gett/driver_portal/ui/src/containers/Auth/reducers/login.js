export const login = (state, { email, password }) => ({
  ...state,
  session: {
    ...state.session,
    loading: true,
    errors: {}
  }
})

export const loginSuccess = (state, { email, password }) => ({
  ...state,
  session: {
    ...state.session,
    loading: false,
    errors: {}
  }
})

export const loginFail = (state, { errors }) => ({
  ...state,
  session: {
    ...state.session,
    loading: false,
    errors
  }
})
