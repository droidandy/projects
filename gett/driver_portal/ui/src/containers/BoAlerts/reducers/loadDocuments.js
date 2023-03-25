export const loadDocuments = (state) => ({
  ...state,
  loading: true,
  finished: false
})

export const loadDocumentsSuccess = (state, { documents }) => ({
  ...state,
  loading: false,
  documents: {
    ...state.documents,
    driver: documents
  }
})

export const loadDocumentsFail = (state) => ({
  ...state,
  loading: false
})
