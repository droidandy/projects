import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadStatementsSuccess, loadStatementsFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'
import { isEmpty } from 'lodash'

function * saga({ from, to, perPage, page, ids, reset }) {
  try {
    let last = false
    const { data: { statements } } = yield call(api().get, '/statements', {
      params: {
        from,
        to,
        perPage,
        page,
        ids
      }
    })

    if (!isEmpty(statements) && statements.length >= perPage) page++
    else last = true
    yield put(loadStatementsSuccess({ statements, page, reset, last }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load statements', error)
    yield put(loadStatementsFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}
export default saga
