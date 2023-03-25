export const loadComments = (state, { noreload }) => ({
  ...state,
  comments: {
    ...state.comments,
    loading: !noreload
  }
})

export const loadCommentsSuccess = (state, { comments }) => {
  return {
    ...state,
    comments: {
      ...state.comments,
      ...comments,
      loading: false
    }
  }
}

export const loadCommentsFail = (state, { errors }) => ({
  ...state,
  comments: {
    ...state.comments,
    errors,
    loading: false
  }
})
