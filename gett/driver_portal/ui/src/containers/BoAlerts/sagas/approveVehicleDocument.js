import { call, put } from 'redux-saga/effects'
import api from 'api'
import { approveVehicleDocumentSuccess, approveVehicleDocumentFail, loadVehicles } from '../actions'
import { showStickyMessage } from 'containers/App/actions'

function * saga({ metadata, userId, documentId, vehicleId }) {
  try {
    const { data: { approvalStatus, lastChange } } = yield call(api().post, `/users/${userId}/vehicles/${vehicleId}/documents/${documentId}/approve`, { metadata })
    yield put(approveVehicleDocumentSuccess({ documentId, metadata, approvalStatus, lastChange }))
    yield put(showStickyMessage({
      kind: 'success',
      text: 'Document has been successfully approved'
    }))
    yield put(loadVehicles({ driverToApproveId: userId }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    console.error('approve document', error)
    yield put(approveVehicleDocumentFail({ errors }))
  }
}

export default saga
