import update from 'update-js'

export const updatePhoneContract = (state) =>
  update(state, 'review.loading', true)

export const updatePhoneContractSuccess = (state, { review }) =>
  update(state, { 'review': review, 'review.loading': false })

export const updatePhoneContractFail = (state, { errors }) =>
  update(state, { 'review.errors': errors, 'review.loading': false })
