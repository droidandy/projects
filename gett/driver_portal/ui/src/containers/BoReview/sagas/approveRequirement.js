import { call, put } from 'redux-saga/effects'
import api from 'api'
import { approveRequirementSuccess, approveRequirementFail, loadHistory } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ userId, requirementType }) {
  try {
    const { data: { review } } = yield call(api().post, `/users/${userId}/review/${requirementType}/approve`)
    yield put(approveRequirementSuccess({ review }))
    yield put(loadHistory({ userId }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Requirement has been successfully approved'
    }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('approve requirement', error)
    yield put(approveRequirementFail({ errors }))
  }
}

export default saga
