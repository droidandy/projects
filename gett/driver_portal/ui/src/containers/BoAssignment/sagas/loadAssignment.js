import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadAssignmentSuccess, loadAssignmentFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'
import { isEmpty } from 'lodash'

function * saga({ page, perPage, reset, query, from, to, readyForAssignment }) {
  try {
    let last = false
    const { data: { drivers } } = yield call(api().get, '/assignment/drivers', {
      params: {
        page,
        perPage,
        query,
        from,
        to,
        readyForAssignment
      }
    })

    if (!isEmpty(drivers) && drivers.length >= perPage) page++
    else last = true
    yield put(loadAssignmentSuccess({ drivers, page, reset, last }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('load Assignment', error)
    yield put(loadAssignmentFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}
export default saga
