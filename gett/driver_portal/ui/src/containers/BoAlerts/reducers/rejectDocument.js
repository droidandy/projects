import update from 'update-js'

export const rejectDocument = (state) =>
  update(state, 'metadata.loading', true, 'showDialog': true)

export const rejectDocumentSuccess = (state, { documentId, metadata, comment, approvalStatus, lastChange }) => {
  return update(state, {
    [`documents.driver.{id:${documentId}}`]: update.assign({
      metadata, comment, approvalStatus, lastChange
    }),
    'metadata.loading': false,
    showDialog: false
  })
}

export const rejectDocumentFail = (state, { errors }) =>
  update(state, { 'metadata.errors': errors, 'metadata.loading': false, showDialog: true })
