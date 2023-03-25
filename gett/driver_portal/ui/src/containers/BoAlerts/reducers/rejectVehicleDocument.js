import update from 'update-js'

export const rejectVehicleDocument = (state) =>
  update(state, 'metadata.loading', true, 'showDialog': true)

export const rejectVehicleDocumentSuccess = (state, { documentId, comment, approvalStatus, lastChange }) => {
  return update(state, {
    [`documents.vehicles.{id:${documentId}}`]: update.assign({
      comment, approvalStatus, lastChange
    }),
    'metadata.loading': false,
    showDialog: false
  })
}

export const rejectVehicleDocumentFail = (state, { errors }) =>
  update(state, { 'metadata.errors': errors, 'metadata.loading': false, showDialog: true })
