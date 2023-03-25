import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadCurrentUser from './loadCurrentUser'
import * as updateCurrentVehicle from './updateCurrentVehicle'
import * as showSystemMessage from './showSystemMessage'
import * as hideSystemMessage from './hideSystemMessage'
import * as showStickyMessage from './showStickyMessage'
import * as hideStickyMessage from './hideStickyMessage'

export const getInitialState = () => ({
  currentUser: {
    loading: true,
    authenticated: false,
    roles: [],
    vehicles: []
  },
  systemMessages: [],
  stickyMessages: []
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadCurrentUser,
  ...updateCurrentVehicle,
  ...showSystemMessage,
  ...hideSystemMessage,
  ...showStickyMessage,
  ...hideStickyMessage
}, getInitialState())

export const getCurrentUser = (state) => {
  const { currentUser } = get(state, NAMESPACE)
  return currentUser
}

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
