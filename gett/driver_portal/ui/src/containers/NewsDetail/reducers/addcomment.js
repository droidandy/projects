export const addComment = (state) => ({
  ...state,
  addcomment: {
    ...state.addcomment,
    errors: {},
    loading: true
  }
})

export const addCommentSuccess = (state, { comment }) => ({
  ...state,
  addcomment: {
    ...state.addcomment,
    content: '',
    errors: {},
    loading: false
  }
})

export const addCommentFail = (state, { errors }) => ({
  ...state,
  addcomment: {
    ...state.addcomment,
    errors,
    loading: false
  }
})

export const resetComment = (state) => ({
  ...state,
  addcomment: {
    errors: {},
    content: '',
    loading: false
  }
})
