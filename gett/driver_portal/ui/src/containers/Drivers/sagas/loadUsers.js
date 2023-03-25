import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadUsersSuccess, loadUsersFail } from '../actions'

function * saga({ page, perPage, query, category, role }) {
  const params = { page, perPage, query, category, role }
  try {
    const { data: { users, total, lastSyncAt } } = yield call(api().get, '/users/drivers', { params })
    yield put(loadUsersSuccess({ users, total, lastSyncAt }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    yield put(loadUsersFail({ errors }))
  }
}

export default saga
