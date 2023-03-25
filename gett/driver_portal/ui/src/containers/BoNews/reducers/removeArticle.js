import { filter } from 'lodash'

export const removeArticle = (state) => ({
  ...state,
  loading: true
})

export const removeArticleSuccess = (state, { id }) => ({
  ...state,
  loading: false,
  news: filter(state.news, article => article.id !== id),
  total: state.total - 1
})

export const removeArticleFail = (state) => ({
  ...state,
  loading: false
})
