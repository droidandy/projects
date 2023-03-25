export const saveDocument = (state) => ({
  ...state,
  document: {
    ...state.document,
    errors: {},
    loading: true
  }
})

export const saveDocumentSuccess = (state, { document }) => ({
  ...state,
  document: {
    ...document,
    errors: {},
    loading: false
  }
})

export const saveDocumentFail = (state, { errors }) => ({
  ...state,
  documents: {
    ...state.document,
    errors,
    loading: false
  }
})
