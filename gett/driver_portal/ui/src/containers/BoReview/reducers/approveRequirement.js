import update from 'update-js'

export const approveRequirement = (state) =>
  update(state, 'rhistory.loading', true)

export const approveRequirementSuccess = (state, { review }) =>
  update(state, { 'rhistory': review, 'rhistory.loading': false })

export const approveRequirementFail = (state, { errors }) =>
  update(state, { 'rhistory.errors': errors, 'rhistory.loading': false })
