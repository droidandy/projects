import update from 'update-js'

export const approveReview = (state) =>
  update(state, 'review.loading', true)

export const approveReviewSuccess = (state, { review }) =>
  update(state, { 'review': review, 'review.loading': false })

export const approveReviewFail = (state, { errors }) =>
  update(state, { 'review.errors': errors, 'review.loading': false })
