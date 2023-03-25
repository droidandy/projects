import { call, put } from 'redux-saga/effects'
import { map, join } from 'lodash'
import api from 'api'
import { emailMeSuccess, emailMeFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ earnings, from, to }) {
  try {
    yield call(api().post, '/earnings/email_me', {
      externalIds: map(earnings, 'externalId'),
      from,
      to
    })
    yield put(emailMeSuccess({ earnings }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Selected earnings have been successfully sent to you'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(emailMeFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: map(errors, e => join(e, '\n'))
    }))
  }
}

export default saga
