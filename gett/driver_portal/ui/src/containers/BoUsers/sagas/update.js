import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateUserSuccess, updateUserFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ user }) {
  try {
    const { data } = yield call(api().put, `/admins/${user.id}`, {
      attributes: user
    })
    yield put(updateUserSuccess({ user: data }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'User has been successfully updated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update user', error)
    yield put(updateUserFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'User update failed'
    }))
  }
}

export default saga
