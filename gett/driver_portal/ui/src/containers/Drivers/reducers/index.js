import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadUsers from './loadUsers'
import * as synchronizeUsers from './synchronizeUsers'

import * as activateUser from './activateUser'
import * as activateUsers from './activateUsers'

import * as deactivateUser from './deactivateUser'
import * as deactivateUsers from './deactivateUsers'

import * as inviteUser from './inviteUser'
import * as inviteUsers from './inviteUsers'

export const getInitialState = () => ({
  loading: true,
  lastSyncAt: null,
  users: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadUsers,
  ...synchronizeUsers,
  ...activateUser,
  ...activateUsers,
  ...deactivateUser,
  ...deactivateUsers,
  ...inviteUser,
  ...inviteUsers
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
