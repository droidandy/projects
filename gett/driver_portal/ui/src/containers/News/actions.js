import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.News'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadNews',
  'loadNewsSuccess',
  'loadNewsFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadNews = ({ perPage, page }) => ({
  type: TYPES.loadNews,
  perPage,
  page
})

export const loadNewsSuccess = ({ news, page, reset, last }) => ({
  type: TYPES.loadNewsSuccess,
  news,
  page,
  reset,
  last
})

export const loadNewsFail = () => ({
  type: TYPES.loadNewsFail
})
