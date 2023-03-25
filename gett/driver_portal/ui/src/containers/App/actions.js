import { createTypes } from 'redux-compose-reducer'
import uuid from 'uuid'

export const NAMESPACE = 'containers.App'

export const TYPES = createTypes(NAMESPACE, [
  'loadCurrentUser',
  'loadCurrentUserSuccess',
  'loadCurrentUserFail',

  'updateCurrentVehicle',
  'updateCurrentVehicleSuccess',
  'updateCurrentVehicleFail',

  'logout',

  'showSystemMessage',
  'hideSystemMessage',

  'showStickyMessage',
  'hideStickyMessage'
])

export const loadCurrentUser = (history = {}, url = '') => ({
  type: TYPES.loadCurrentUser,
  history,
  url
})

export const loadCurrentUserSuccess = ({ currentUser }) => ({
  type: TYPES.loadCurrentUserSuccess,
  currentUser
})

export const loadCurrentUserFail = () => ({
  type: TYPES.loadCurrentUserFail
})

export const logout = ({ currentUser }) => ({
  type: TYPES.logout,
  currentUser
})

export const showSystemMessage = (message) => ({
  type: TYPES.showSystemMessage,
  message: {
    ...message,
    uuid: uuid()
  }
})

export const hideSystemMessage = (message) => ({
  type: TYPES.hideSystemMessage,
  message
})

export const showStickyMessage = (message) => ({
  type: TYPES.showStickyMessage,
  message: {
    ...message,
    uuid: uuid()
  }
})

export const hideStickyMessage = (message) => ({
  type: TYPES.hideStickyMessage,
  message
})

export const updateCurrentVehicle = ({ vehicle }) => ({
  type: TYPES.updateCurrentVehicle,
  vehicle
})

export const updateCurrentVehicleSuccess = ({ vehicles }) => ({
  type: TYPES.updateCurrentVehicleSuccess,
  vehicles
})

export const updateCurrentVehicleFail = () => ({
  type: TYPES.updateCurrentVehicleFail
})
