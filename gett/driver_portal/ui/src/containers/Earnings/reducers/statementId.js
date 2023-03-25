export const loadStatementId = (state) => ({
  ...state,
  loadingStatementId: true
})

export const loadedStatementId = (state, { id, earningsId }) => {
  const earnings = [ ...state.earnings ]
  earnings[earningsId].statementId = id
  return {
    ...state,
    loadingStatementId: false,
    earnings
  }
}

export const failedStatementId = (state) => ({
  ...state,
  loadingStatementId: false
})
