import { call, put } from 'redux-saga/effects'
import api from 'api'
import { createUserSuccess, createUserFail } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ user }) {
  try {
    const { data } = yield call(api().post, `/admins`, {
      attributes: user
    })
    yield put(createUserSuccess({ user: data }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'User has been successfully created'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update user', error)
    yield put(createUserFail({ errors }))
    yield put(showStickyMessage({
      kind: 'error',
      text: 'User create failed'
    }))
  }
}

export default saga
