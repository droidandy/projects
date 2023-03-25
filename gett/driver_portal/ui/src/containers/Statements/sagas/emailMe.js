import { call, put } from 'redux-saga/effects'
import { map, join } from 'lodash'
import api from 'api'
import { emailMeSuccess, emailMeFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ statements }) {
  try {
    yield call(api().post, '/statements/email_me', { ids: map(statements, 'id') })
    yield put(emailMeSuccess({ statements }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Selected statements have been successfully sent to you'
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
