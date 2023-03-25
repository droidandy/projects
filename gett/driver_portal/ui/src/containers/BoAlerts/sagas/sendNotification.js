import { call, put } from 'redux-saga/effects'
import api from 'api'
import { sendNotificationSuccess, sendNotificationFail } from '../actions'
import { showSystemMessage, showStickyMessage } from 'containers/App/actions'

function * saga({ driverToApproveId, message }) {
  try {
    yield call(api().post, `/users/${driverToApproveId}/approval/finish`, message)
    yield put(sendNotificationSuccess())
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Notification has been sent successfully'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('send notification', error)
    yield put(sendNotificationFail({ errors }))

    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export default saga
