import { call, put } from 'redux-saga/effects'
import api from 'api'
import { activateUserSuccess, activateUserFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ user }) {
  try {
    const { data } = yield call(api().post, `/users/${user.id}/activate`)

    yield put(activateUserSuccess({
      user: { ...user, ...data }
    }))

    yield put(showStickyMessage({
      kind: 'success',
      text: 'User has been successfully activated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(activateUserFail({ errors }))
  }
}

export default saga
