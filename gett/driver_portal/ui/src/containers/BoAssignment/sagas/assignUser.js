import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updateSuccess } from '../actions'
import { loadCurrentUser, showSystemMessage } from 'containers/App/actions'

function * saga({ driver, agentId }) {
  try {
    const { data } = yield call(api().post, `/assignment/agents/${agentId}/assign_driver`, {
      driverId: driver.id
    })
    yield put(updateSuccess({ data }))
    yield put(loadCurrentUser())
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('Assignment driver to agent', error)

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}
export default saga
