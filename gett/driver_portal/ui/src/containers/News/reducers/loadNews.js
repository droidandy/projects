export const loadNews = (state) => ({
  ...state,
  loading: true,
  last: false
})

export const loadNewsSuccess = (state, { news, page, reset, last }) => {
  let newNews
  if (reset) newNews = news
  else newNews = [ ...state.news, ...news ]
  return {
    ...state,
    loading: false,
    news: newNews,
    page,
    last
  }
}

export const loadNewsFail = (state) => ({
  ...state,
  loading: false,
  last: false
})
