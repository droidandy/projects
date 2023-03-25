import { call, put } from 'redux-saga/effects'
import { map, join } from 'lodash'
import api from 'api'
import { loadDetailsSuccess, loadDetailsFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ id, issuedAt }) {
  try {
    const { data } = yield call(api().get, `/orders/${id}`)
    yield put(loadDetailsSuccess({ id, details: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(loadDetailsFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: map(errors, e => join(e, '\n'))
    }))
  }
}

export default saga
