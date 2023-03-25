export const loadVehiclesDocuments = (state) => ({
  ...state,
  loading: true
})

export const loadVehiclesDocumentsSuccess = (state, { documents }) => ({
  ...state,
  loading: false,
  documents: {
    ...state.documents,
    vehicles: documents
  }
})

export const loadVehiclesDocumentsFail = (state) => ({
  ...state,
  loading: false
})
