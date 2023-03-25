export const saveNews = (state) => ({
  ...state,
  news: {
    ...state.news,
    errors: {},
    loading: true
  }
})

export const saveNewsSuccess = (state, { news }) => ({
  ...state,
  news: {
    ...state.news,
    news: {},
    errors: {},
    loading: false
  }
})

export const saveNewsFail = (state, { errors }) => ({
  ...state,
  news: {
    ...state.news,
    errors,
    loading: false
  }
})

export const resetNews = (state) => ({
  ...state,
  news: { loading: false }
})
