import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.BoNews'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadNews',
  'loadNewsSuccess',
  'loadNewsFail',

  'removeArticle',
  'removeArticleSuccess',
  'removeArticleFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadNews = ({ perPage, page }) => ({
  type: TYPES.loadNews,
  perPage,
  page
})

export const loadNewsSuccess = ({ news, total }) => ({
  type: TYPES.loadNewsSuccess,
  news,
  total
})

export const loadNewsFail = () => ({
  type: TYPES.loadNewsFail
})

export const removeArticle = ({ item }) => ({
  type: TYPES.removeArticle,
  item
})

export const removeArticleSuccess = ({ id }) => ({
  type: TYPES.removeArticleSuccess,
  id
})

export const removeArticleFail = () => ({
  type: TYPES.removeArticleFail
})
