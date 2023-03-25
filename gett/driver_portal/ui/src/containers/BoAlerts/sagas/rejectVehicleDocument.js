import { call, put } from 'redux-saga/effects'
import api from 'api'
import { rejectVehicleDocumentSuccess, rejectVehicleDocumentFail, loadVehicles } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ comment, userId, documentId, vehicleId }) {
  try {
    const { data: { approvalStatus, lastChange } } = yield call(api().post, `/users/${userId}/vehicles/${vehicleId}/documents/${documentId}/reject`, { comment })
    yield put(rejectVehicleDocumentSuccess({ documentId, comment, approvalStatus, lastChange }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Document has been successfully rejected'
    }))
    yield put(loadVehicles({ driverToApproveId: userId }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('reject document', error)
    yield put(rejectVehicleDocumentFail({ errors }))
  }
}

export default saga
