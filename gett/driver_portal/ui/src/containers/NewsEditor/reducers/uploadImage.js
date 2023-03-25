export const uploadImage = (state) => ({
  ...state,
  news: {
    ...state.news,
    loading: false
  }
})

export const uploadImageSuccess = (state, { imageInsert }) => ({
  ...state,
  news: {
    ...state.news,
    loading: false
  },
  imageInsert
})

export const uploadImageFail = (state, { errors }) => ({
  ...state,
  news: {
    ...state.news,
    errors,
    loading: false
  },
  imageInsert: {}
})
