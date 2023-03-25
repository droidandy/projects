export const signUp = (state) => ({
  ...state
})

export const signUpSuccess = (state) => ({
  ...state,
  user: {
    success: true
  },
  errors: {}
})

export const signUpFail = (state, { errors }) => ({
  ...state,
  errors
})
