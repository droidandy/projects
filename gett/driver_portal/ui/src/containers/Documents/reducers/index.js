import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadVehicles from './loadVehicles'
import * as loadDocuments from './loadDocuments'
import * as saveDocument from './saveDocument'
import * as saveVehicle from './saveVehicle'

import * as update from './updateVehicle'
import * as create from './createVehicle'
import * as remove from './removeVehicle'

export const getInitialState = () => ({
  loading: true,
  vehicles: [],
  documents: [],
  document: {},
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
  ...loadVehicles,
  ...loadDocuments,
  ...update,
  ...create,
  ...saveDocument,
  ...saveVehicle,
  ...remove
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
