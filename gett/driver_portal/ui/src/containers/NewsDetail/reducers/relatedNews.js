export const loadRelatedNews = (state, { noreload }) => ({
  ...state,
  relatedNews: {
    ...state.relatedNews,
    loading: true
  }
})

export const loadRelatedNewsSuccess = (state, { news }) => {
  return {
    ...state,
    relatedNews: {
      ...state.relatedNews,
      news,
      loading: false
    }
  }
}
