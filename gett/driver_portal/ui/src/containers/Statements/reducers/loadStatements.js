export const loadStatements = (state) => ({
  ...state,
  loading: true,
  last: false
})

export const loadStatementsSuccess = (state, { statements, page, reset, last }) => {
  let newStatements
  if (reset) newStatements = statements
  else newStatements = [ ...state.statements, ...statements ]
  return {
    ...state,
    loading: false,
    statements: newStatements,
    page,
    last
  }
}

export const loadStatementsFail = (state) => ({
  ...state,
  loading: false,
  last: false
})
