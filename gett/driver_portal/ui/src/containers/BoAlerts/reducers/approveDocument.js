import update from 'update-js'

export const approveDocument = (state) =>
  update(state, 'metadata.loading', true)

export const approveDocumentSuccess = (state, { documentId, metadata, approvalStatus, lastChange }) => {
  return update(state, {
    [`documents.driver.{id:${documentId}}`]: update.assign({
      metadata, approvalStatus, lastChange
    }),
    'metadata.loading': false
  })
}

export const approveDocumentFail = (state, { errors }) =>
  update(state, { 'metadata.errors': errors, 'metadata.loading': false })
