import { call, put } from 'redux-saga/effects'
import api from 'api'
import { synchronizeUsersSuccess, synchronizeUsersFail } from '../actions'

function * saga() {
  try {
    const { data: { lastSyncAt } } = yield call(api().post, '/users/sync')
    yield put(synchronizeUsersSuccess({ lastSyncAt }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(synchronizeUsersFail({ errors }))
  }
}

export default saga
