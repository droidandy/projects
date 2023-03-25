import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadLoginCountSuccess, loadLoginCountError } from '../actions'

function * loadLoginCount({ from, to, period }) {
  try {
    const { data: { entries } } = yield call(api().get, `statistics/${period}/login_count`, {
      params: {
        from,
        to
      }
    })
    yield put(loadLoginCountSuccess({ entries }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load LoginCount', error)
    yield put(loadLoginCountError({ errors }))
  }
}

export {
  loadLoginCount
}
