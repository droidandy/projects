import update from 'update-js'

export const approveVehicleDocument = (state) =>
  update(state, 'metadata.loading', true)

export const approveVehicleDocumentSuccess = (state, { documentId, metadata, approvalStatus, lastChange }) => {
  return update(state, {
    [`documents.vehicles.{id:${documentId}}`]: update.assign({
      metadata, approvalStatus, lastChange
    }),
    'metadata.loading': false
  })
}

export const approveVehicleDocumentFail = (state, { errors }) =>
  update(state, { 'metadata.errors': errors, 'metadata.loading': false })
