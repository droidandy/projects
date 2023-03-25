import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadActiveUsersSuccess, loadActiveUsersError } from '../actions'

function * loadActiveUsers({ from, to, period }) {
  try {
    const { data: { entries } } = yield call(api().get, `statistics/${period}/active_users`, {
      params: {
        from,
        to
      }
    })
    yield put(loadActiveUsersSuccess({ entries }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load ActiveUsers', error)
    yield put(loadActiveUsersError({ errors }))
  }
}

export {
  loadActiveUsers
}
