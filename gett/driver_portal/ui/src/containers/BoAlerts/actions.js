import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.BoAlerts'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadDocuments',
  'loadDocumentsSuccess',
  'loadDocumentsFail',

  'loadKinds',
  'loadKindsSuccess',
  'loadKindsFail',

  'loadVehicles',
  'loadVehiclesSuccess',
  'loadVehiclesFail',

  'loadVehiclesDocuments',
  'loadVehiclesDocumentsSuccess',
  'loadVehiclesDocumentsFail',

  'loadVehiclesKinds',
  'loadVehiclesKindsSuccess',
  'loadVehiclesKindsFail',

  'loginAsUser',
  'exitAlerts',

  'approveDocument',
  'approveDocumentSuccess',
  'approveDocumentFail',

  'approveVehicleDocument',
  'approveVehicleDocumentSuccess',
  'approveVehicleDocumentFail',

  'rejectDocument',
  'rejectDocumentSuccess',
  'rejectDocumentFail',

  'rejectVehicleDocument',
  'rejectVehicleDocumentSuccess',
  'rejectVehicleDocumentFail',

  'loadUser',
  'loadUserSuccess',
  'loadUserFail',

  'sendNotification',
  'sendNotificationSuccess',
  'sendNotificationFail',

  'updateVehicleDetails',
  'updateVehicleDetailsSuccess',
  'updateVehicleDetailsFail',

  'loadNextDriver',

  'loadNotificationMsg',
  'loadNotificationMsgSuccess',
  'loadNotificationMsgFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadDocuments = ({ driverToApproveId }) => ({
  type: TYPES.loadDocuments,
  driverToApproveId
})

export const loadDocumentsSuccess = ({ documents }) => ({
  type: TYPES.loadDocumentsSuccess,
  documents
})

export const loadDocumentsFail = () => ({
  type: TYPES.loadDocumentsFail
})

export const loadKinds = ({ driverToApproveId }) => ({
  type: TYPES.loadKinds,
  driverToApproveId
})

export const loadKindsSuccess = ({ kinds }) => ({
  type: TYPES.loadKindsSuccess,
  kinds
})

export const loadKindsFail = () => ({
  type: TYPES.loadKindsFail
})

export const loadVehicles = ({ driverToApproveId }) => ({
  type: TYPES.loadVehicles,
  driverToApproveId
})

export const loadVehiclesSuccess = ({ vehicles }) => ({
  type: TYPES.loadVehiclesSuccess,
  vehicles
})

export const loadVehiclesFail = () => ({
  type: TYPES.loadVehiclesFail
})

export const loadVehiclesDocuments = ({ driverToApproveId, vehicleId }) => ({
  type: TYPES.loadVehiclesDocuments,
  driverToApproveId,
  vehicleId
})

export const loadVehiclesDocumentsSuccess = ({ documents }) => ({
  type: TYPES.loadVehiclesDocumentsSuccess,
  documents
})

export const loadVehiclesDocumentsFail = () => ({
  type: TYPES.loadVehiclesDocumentsFail
})

export const loadVehiclesKinds = ({ driverToApproveId, vehicleId }) => ({
  type: TYPES.loadVehiclesKinds,
  driverToApproveId,
  vehicleId
})

export const loadVehiclesKindsSuccess = ({ kinds }) => ({
  type: TYPES.loadVehiclesKindsSuccess,
  kinds
})

export const loadVehiclesKindsFail = () => ({
  type: TYPES.loadVehiclesKindsFail
})

export const loginAsUser = ({ driverToApproveId }) => ({
  type: TYPES.loginAsUser,
  driverToApproveId
})

export const approveDocument = ({ metadata, userId, documentId }) => ({
  type: TYPES.approveDocument,
  metadata,
  userId,
  documentId
})

export const approveDocumentSuccess = ({ documentId, metadata, approvalStatus, lastChange }) => ({
  type: TYPES.approveDocumentSuccess,
  documentId,
  metadata,
  approvalStatus,
  lastChange
})

export const approveDocumentFail = ({ errors }) => ({
  type: TYPES.approveDocumentFail,
  errors
})

export const approveVehicleDocument = ({ metadata, userId, documentId, vehicleId }) => ({
  type: TYPES.approveVehicleDocument,
  metadata,
  userId,
  documentId,
  vehicleId
})

export const approveVehicleDocumentSuccess = ({ documentId, metadata, approvalStatus, lastChange }) => ({
  type: TYPES.approveVehicleDocumentSuccess,
  documentId,
  metadata,
  approvalStatus,
  lastChange
})

export const approveVehicleDocumentFail = ({ errors }) => ({
  type: TYPES.approveVehicleDocumentFail,
  errors
})

export const rejectDocument = ({ metadata, comment, userId, documentId }) => ({
  type: TYPES.rejectDocument,
  metadata,
  comment,
  userId,
  documentId
})

export const rejectDocumentSuccess = ({ documentId, metadata, comment, approvalStatus, lastChange }) => ({
  type: TYPES.rejectDocumentSuccess,
  documentId,
  metadata,
  comment,
  approvalStatus,
  lastChange
})

export const rejectDocumentFail = ({ errors }) => ({
  type: TYPES.rejectDocumentFail,
  errors
})

export const rejectVehicleDocument = ({ metadata, comment, userId, documentId, vehicleId }) => ({
  type: TYPES.rejectVehicleDocument,
  metadata,
  comment,
  userId,
  documentId,
  vehicleId
})

export const rejectVehicleDocumentSuccess = ({ documentId, comment, approvalStatus, lastChange }) => ({
  type: TYPES.rejectVehicleDocumentSuccess,
  documentId,
  comment,
  approvalStatus,
  lastChange
})

export const rejectVehicleDocumentFail = ({ errors }) => ({
  type: TYPES.rejectVehicleDocumentFail,
  errors
})

export const exitAlerts = ({ driverToApproveId, history }) => ({
  type: TYPES.exitAlerts,
  driverToApproveId,
  history
})

export const loadUser = ({ userId }) => ({
  type: TYPES.loadUser,
  userId
})

export const loadUserSuccess = ({ user }) => ({
  type: TYPES.loadUserSuccess,
  user
})

export const loadUserFail = () => ({
  type: TYPES.loadUserFail
})

export const sendNotification = ({ driverToApproveId, message }) => ({
  type: TYPES.sendNotification,
  driverToApproveId,
  message
})

export const sendNotificationSuccess = () => ({
  type: TYPES.sendNotificationSuccess
})

export const sendNotificationFail = () => ({
  type: TYPES.sendNotificationFail
})

export const updateVehicleDetails = ({ model, userId, vehicleId }) => ({
  type: TYPES.updateVehicleDetails,
  model,
  userId,
  vehicleId
})

export const updateVehicleDetailsSuccess = ({ vehicleId, model }) => ({
  type: TYPES.updateVehicleDetailsSuccess,
  model,
  vehicleId
})

export const updateVehicleDetailsFail = ({ vehicleId, errors }) => ({
  type: TYPES.updateVehicleDetailsFail,
  vehicleId,
  errors
})

export const loadNextDriver = ({ history }) => ({
  type: TYPES.loadNextDriver,
  history
})

export const loadNotificationMsg = ({ driverToApproveId }) => ({
  type: TYPES.loadNotificationMsg,
  driverToApproveId
})

export const loadNotificationMsgSuccess = ({ notification }) => ({
  type: TYPES.loadNotificationMsgSuccess,
  notification
})

export const loadNotificationMsgFail = ({ errors }) => ({
  type: TYPES.loadNotificationMsgFail,
  errors
})
