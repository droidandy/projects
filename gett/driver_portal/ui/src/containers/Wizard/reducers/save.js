export const save = (state) => ({
  ...state
})

export const saveSuccess = (state, { user }) => ({
  ...state,
  user,
  errors: {}
})

export const saveFail = (state, { errors }) => ({
  ...state,
  errors
})
