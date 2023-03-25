import { call, put } from 'redux-saga/effects'
import { map, join } from 'lodash'
import api from 'api'
import { shareWithSuccess, shareWithFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ statements, receivers, message }) {
  try {
    yield call(api().post, '/statements/share', {
      ids: map(statements, 'id'),
      emails: receivers,
      body: message
    })
    yield put(shareWithSuccess({ statements, receivers, message }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Selected statements have been successfully shared'
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
