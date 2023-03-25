import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as loadDocuments from './loadDocuments'
import * as loadKinds from './loadKinds'
import * as loadVehiclesDocuments from './loadVehiclesDocuments'
import * as loadVehiclesKinds from './loadVehiclesKinds'
import * as loadVehicles from './loadVehicles'
import * as loadUser from './loadUser'
import * as approveDocument from './approveDocument'
import * as approveVehicleDocument from './approveVehicleDocument'
import * as rejectDocument from './rejectDocument'
import * as rejectVehicleDocument from './rejectVehicleDocument'
import * as updateVehicleDetails from './updateVehicleDetails'
import * as sendNotification from './sendNotification'
import * as loadNotificationMsg from './loadNotificationMsg'

export const getInitialState = () => ({
  loading: true,
  documents: {
    driver: [],
    vehicles: []
  },
  kinds: {
    driver: [],
    vehicles: []
  },
  vehicles: [],
  metadata: {
    loading: false,
    errors: {}
  },
  user: {
    loading: false
  },
  finished: false,
  notification: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadDocuments,
  ...loadKinds,
  ...loadVehiclesDocuments,
  ...loadVehiclesKinds,
  ...loadVehicles,
  ...approveDocument,
  ...approveVehicleDocument,
  ...rejectDocument,
  ...rejectVehicleDocument,
  ...loadUser,
  ...updateVehicleDetails,
  ...sendNotification,
  ...loadNotificationMsg
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
