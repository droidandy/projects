export const loadNews = (state) => ({
  ...state,
  news: {
    ...state.news,
    loading: true
  }
})

export const loadNewsSuccess = (state, { news }) => {
  return {
    ...state,
    news: {
      ...state.news,
      ...news,
      loading: false
    }
  }
}

export const loadNewsFail = (state, { errors }) => ({
  ...state,
  news: {
    ...state.news,
    errors,
    loading: false
  }
})
