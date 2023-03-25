import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateUserSuccess, updateFail } from '../actions'
import { loadCurrentUser, showStickyMessage } from 'containers/App/actions'

function * saga({ user, history, url }) {
  try {
    yield call(api().put, '/session', {
      attributes: user
    })
    yield put(updateUserSuccess())
    yield put(loadCurrentUser())
    yield call(history.push, url)
    yield put(showStickyMessage({
      kind: 'success',
      text: 'User has been successfully updated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update user', error)
    yield put(updateFail({ errors }))
  }
}

export default saga
