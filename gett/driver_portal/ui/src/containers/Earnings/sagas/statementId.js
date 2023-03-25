import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadedStatementId, failedStatementId } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ issuedAt, earningsId }) {
  try {
    const { data: { id } } = yield call(api().get, '/statements/by_date', {
      params: {
        issuedAt
      }
    })

    yield put(loadedStatementId({ id, earningsId }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load statementId', error)
    yield put(failedStatementId({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
