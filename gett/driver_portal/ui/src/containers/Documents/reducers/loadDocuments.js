export const loadDocuments = (state) => ({
  ...state,
  loading: true
})

export const loadDocumentsSuccess = (state, { documents }) => ({
  ...state,
  loading: false,
  documents
})

export const loadDocumentsFail = (state) => ({
  ...state,
  loading: false
})
