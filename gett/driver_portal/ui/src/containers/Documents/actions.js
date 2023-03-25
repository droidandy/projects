import { createTypes } from 'redux-compose-reducer'

export const NAMESPACE = 'containers.Documents'

export const TYPES = createTypes(NAMESPACE, [
  'initialize',

  'loadVehicles',
  'loadVehiclesSuccess',
  'loadVehiclesFail',

  'renameVehicle',
  'renameVehicleSuccess',
  'renameVehicleFail',

  'loadDocuments',
  'loadDocumentsSuccess',
  'loadDocumentsFail',

  'saveDocument',
  'saveDocumentSuccess',
  'saveDocumentFail',

  'saveVehicle',
  'saveVehicleSuccess',
  'saveVehicleFail',

  'createVehicle',
  'createVehicleSuccess',
  'createVehicleFail',

  'updateVehicle',
  'updateVehicleSuccess',
  'updateVehicleFail',

  'removeVehicle',
  'removeVehicleSuccess',
  'removeVehicleFail'
])

export const initialize = () => ({
  type: TYPES.initialize
})

export const loadVehicles = () => ({
  type: TYPES.loadVehicles
})

export const loadVehiclesSuccess = ({ vehicles }) => ({
  type: TYPES.loadVehiclesSuccess,
  vehicles
})

export const loadVehiclesFail = () => ({
  type: TYPES.loadVehiclesFail
})

export const renameVehicle = ({ id }) => ({
  type: TYPES.renameVehicle,
  id
})

export const renameVehiclesSuccess = ({ vehicle }) => ({
  type: TYPES.renameVehicleSuccess,
  vehicle
})

export const renameVehicleFail = () => ({
  type: TYPES.renameVehicleFail
})

export const loadDocuments = () => ({
  type: TYPES.loadDocuments
})

export const loadDocumentsSuccess = ({ documents }) => ({
  type: TYPES.loadDocumentsSuccess,
  documents
})

export const loadDocumentsFail = () => ({
  type: TYPES.loadDocumentsFail
})

export const saveDocument = ({ file, kind }) => ({
  type: TYPES.saveDocument,
  file,
  kind

})
export const saveDocumentSuccess = ({ document }) => ({
  type: TYPES.saveDocumentSuccess,
  document
})

export const saveDocumentFail = ({ errors }) => ({
  type: TYPES.saveDocumentFail,
  errors
})

export const saveVehicle = ({ file, kind, id }) => ({
  type: TYPES.saveVehicle,
  file,
  kind,
  id

})
export const saveVehicleSuccess = ({ document }) => ({
  type: TYPES.saveVehicleSuccess,
  document
})

export const saveVehicleFail = ({ errors }) => ({
  type: TYPES.saveVehicleFail,
  errors
})

export const updateVehicle = ({ vehicle }) => ({
  type: TYPES.updateVehicle,
  vehicle
})

export const updateVehicleSuccess = ({ vehicle }) => ({
  type: TYPES.updateVehicleSuccess,
  vehicle
})

export const updateVehicleFail = ({ errors }) => ({
  type: TYPES.updateVehicleFail,
  errors
})

export const createVehicle = ({ vehicle }) => ({
  type: TYPES.createVehicle,
  vehicle
})

export const createVehicleSuccess = ({ vehicle }) => ({
  type: TYPES.createVehicleSuccess,
  vehicle
})

export const createVehicleFail = ({ errors }) => ({
  type: TYPES.createVehicleFail,
  errors
})

export const removeVehicle = ({ vehicle }) => ({
  type: TYPES.removeVehicle,
  vehicle
})

export const removeVehicleSuccess = ({ vehicle }) => ({
  type: TYPES.removeVehicleSuccess,
  id: vehicle.id
})

export const removeVehicleFail = ({ errors }) => ({
  type: TYPES.removeVehicleFail,
  errors
})
