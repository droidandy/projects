import { call, put } from 'redux-saga/effects'
import api from 'api'
import { updatePhoneContractSuccess, updatePhoneContractFail, loadStats, loadHistory } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ properties, userId }) {
  try {
    const { data: { review } } = yield call(api().post, `/users/${userId}/review/phone_contract/approve`, { ...properties })
    yield put(updatePhoneContractSuccess({ review }))
    yield put(loadStats({ userId }))
    yield put(loadHistory({ userId }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Requirement has been successfully updated'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('update requirement', error)
    yield put(updatePhoneContractFail({ errors }))
  }
}

export default saga
