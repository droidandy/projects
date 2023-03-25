import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.NewsEditor'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadNews',
  'loadNewsSuccess',
  'loadNewsFail',

  'resetNews',
  'saveNews',
  'saveNewsSuccess',
  'saveNewsFail',

  'uploadImage',
  'uploadImageSuccess',
  'uploadImageFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadNews = ({ id }) => ({
  type: TYPES.loadNews,
  id
})

export const loadNewsSuccess = ({ news }) => ({
  type: TYPES.loadNewsSuccess,
  news
})

export const loadNewsFail = ({ errors }) => ({
  type: TYPES.loadNewsFail,
  errors
})

export const resetNews = () => ({
  type: TYPES.resetNews
})

export const saveNews = ({ news, callback }) => ({
  type: TYPES.saveNews,
  news,
  callback
})

export const saveNewsSuccess = ({ news }) => ({
  type: TYPES.saveNewsSuccess,
  news
})

export const saveNewsFail = ({ errors }) => ({
  type: TYPES.saveNewsFail,
  errors
})

export const uploadImage = ({ image, bindingHash, newsId }) => ({
  type: TYPES.uploadImage,
  image,
  bindingHash,
  newsId
})

export const uploadImageSuccess = ({ imageInsert }) => ({
  type: TYPES.uploadImageSuccess,
  imageInsert
})

export const uploadImageFail = ({ errors }) => ({
  type: TYPES.uploadImageFail,
  errors
})
