import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadNotificationMsgSuccess, loadNotificationMsgFail } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * saga({ driverToApproveId }) {
  try {
    const { data } = yield call(api().get, `/users/${driverToApproveId}/approval/notification`)
    yield put(loadNotificationMsgSuccess({ notification: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('send notification', error)
    yield put(loadNotificationMsgFail({ errors }))
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
