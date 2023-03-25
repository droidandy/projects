import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.NewsDetail'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadNews',
  'loadNewsSuccess',
  'loadNewsFail',

  'loadComments',
  'loadCommentsSuccess',
  'loadCommentsFail',

  'likeComment',
  'dislikeComment',
  'deleteComment',

  'addComment',
  'addCommentSuccess',
  'addCommentFail',
  'resetComment',

  'loadRelatedNews',
  'loadRelatedNewsSuccess'
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

export const loadComments = ({ id, noreload }) => ({
  type: TYPES.loadComments,
  id,
  noreload
})

export const loadCommentsSuccess = ({ comments }) => ({
  type: TYPES.loadCommentsSuccess,
  comments
})

export const loadCommentsFail = ({ errors }) => ({
  type: TYPES.loadCommentsFail,
  errors
})

export const resetComment = () => ({
  type: TYPES.resetComment
})

export const addComment = ({ id, nestedId, content }) => ({
  type: TYPES.addComment,
  id,
  content,
  nestedId
})

export const addCommentSuccess = ({ comment }) => ({
  type: TYPES.addCommentSuccess,
  comment
})

export const addCommentFail = ({ errors }) => ({
  type: TYPES.addCommentFail,
  errors
})

export const likeComment = ({ id, commentId }) => ({
  type: TYPES.likeComment,
  id,
  commentId
})

export const dislikeComment = ({ id, commentId }) => ({
  type: TYPES.dislikeComment,
  id,
  commentId
})

export const deleteComment = ({ id, commentId }) => ({
  type: TYPES.deleteComment,
  id,
  commentId
})

export const loadRelatedNews = ({ page, perPage, sortDirection, sortColumn }) => ({
  type: TYPES.loadRelatedNews,
  page,
  perPage,
  sortDirection,
  sortColumn
})

export const loadRelatedNewsSuccess = ({ news }) => ({
  type: TYPES.loadRelatedNewsSuccess,
  news
})
