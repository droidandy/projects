import { call, put } from 'redux-saga/effects'
import api from 'api'
import { deactivateUserSuccess, deactivateUserFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ user }) {
  try {
    const { data } = yield call(api().post, `/users/${user.id}/deactivate`)

    yield put(deactivateUserSuccess({
      user: { ...user, ...data }
    }))

    yield put(showStickyMessage({
      kind: 'success',
      text: 'User has been successfully deactivated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(deactivateUserFail({ errors }))
  }
}

export default saga
