import update from 'update-js'

export const rejectReview = (state) =>
  update(state, { 'review.loading': true, 'review.showDialog': true })

export const rejectReviewSuccess = (state, { review }) =>
  update(state, { 'review': review, 'review.loading': false, 'review.showDialog': false })

export const rejectReviewFail = (state, { errors }) =>
  update(state, { 'review.errors': errors, 'review.loading': false, 'review.showDialog': true })
