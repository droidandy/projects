export const updateAvatar = (state) => ({
  ...state,
  avatar: {
    ...state.avatar,
    loading: true
  }
})

export const updateAvatarSuccess = (state) => ({
  ...state,
  avatar: {
    ...state.avatar,
    loading: false
  }
})

export const updateAvatarFail = (state, { errors }) => ({
  ...state,
  avatar: {
    ...state.avatar,
    errors,
    loading: false
  }
})
