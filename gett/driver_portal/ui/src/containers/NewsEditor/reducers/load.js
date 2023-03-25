export const loadNews = (state) => ({
  ...state,
  news: {
    ...state.news,
    errors: {},
    loading: true
  }
})

export const loadNewsSuccess = (state, { news }) => {
  const newsNew = { ...news }
  if (!newsNew.content) newsNew.content = ''
  return {
    ...state,
    news: {
      ...state.news,
      ...newsNew,
      errors: {},
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
