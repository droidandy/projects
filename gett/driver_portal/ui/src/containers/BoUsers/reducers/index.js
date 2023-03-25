import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadUsers from './loadUsers'

import * as activateUser from './activateUser'

import * as deactivateUser from './deactivateUser'

import * as inviteUser from './inviteUser'

import * as update from './update'

import * as create from './create'

export const getInitialState = () => ({
  loading: true,
  users: {},
  update: {
    loading: false,
    errors: {}
  },
  create: {
    loading: false,
    errors: {}
  }
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadUsers,
  ...activateUser,
  ...deactivateUser,
  ...inviteUser,
  ...update,
  ...create
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
