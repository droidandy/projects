import { call, put } from 'redux-saga/effects'
import api from 'api'
import { sendMessageSuccess, sendMessageFailed } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * sendMessage({ message }) {
  try {
    yield call(api().post, '/support_requests', {
      message
    })
    yield put(sendMessageSuccess())
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Message has been successfully sent'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('send suppurt message', error)
    yield put(sendMessageFailed({ errors }))
  }
}

export {
  sendMessage
}
