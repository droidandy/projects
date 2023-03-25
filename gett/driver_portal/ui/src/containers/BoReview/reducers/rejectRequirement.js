import update from 'update-js'

export const rejectRequirement = (state) =>
  update(state, { 'rhistory.loading': true, 'rhistory.showDialog': true })

export const rejectRequirementSuccess = (state, { review }) =>
  update(state, { 'rhistory': review, 'rhistory.loading': false, 'rhistory.showDialog': false })

export const rejectRequirementFail = (state, { errors }) =>
  update(state, { 'rhistory.errors': errors, 'rhistory.loading': false, 'rhistory.showDialog': true })
