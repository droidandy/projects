import { call, put } from 'redux-saga/effects'
import { map, join } from 'lodash'
import api from 'api'
import { shareWithSuccess, shareWithFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ earnings, receivers, message, from, to }) {
  try {
    yield call(api().post, '/earnings/share', {
      externalIds: map(earnings, 'externalId'),
      emails: receivers,
      body: message,
      from,
      to
    })
    yield put(shareWithSuccess({ earnings, receivers, message }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Selected earnings have been successfully shared'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(shareWithFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: map(errors, e => join(e, '\n'))
    }))
  }
}

export default saga
