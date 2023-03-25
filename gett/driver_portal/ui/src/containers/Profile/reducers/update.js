export const updateUser = (state) => ({
  ...state,
  update: {
    ...state.update,
    loading: true
  }
})

export const updateUserSuccess = (state) => ({
  ...state,
  update: {
    ...state.update,
    loading: false
  }
})

export const updateFail = (state, { errors }) => ({
  ...state,
  update: {
    ...state.update,
    errors,
    loading: false
  }
})
