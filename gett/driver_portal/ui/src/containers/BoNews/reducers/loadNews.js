export const loadNews = (state) => ({
  ...state,
  loading: true,
  last: false
})

export const loadNewsSuccess = (state, { news, total }) => {
  return {
    ...state,
    loading: false,
    news,
    total
  }
}

export const loadNewsFail = (state) => ({
  ...state,
  loading: false,
  last: false
})
