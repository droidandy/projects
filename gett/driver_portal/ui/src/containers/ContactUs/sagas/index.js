import { takeEvery } from 'redux-saga/effects'
import { TYPES } from '../actions'
import * as messages from './messages'

export default function * sagas() {
  yield takeEvery(TYPES.send, messages.sendMessage)
}
