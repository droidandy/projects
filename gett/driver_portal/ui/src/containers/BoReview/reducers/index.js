import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'

import * as approveReview from './approveReview'
import * as rejectReview from './rejectReview'
import * as rejectRequirement from './rejectRequirement'
import * as approveRequirement from './approveRequirement'
import * as updatePhoneContract from './updatePhoneContract'
import * as rhistory from './history'
import * as stats from './stats'

export const getInitialState = () => ({
  loading: true,
  review: {
    loading: true
  },
  rhistory: {
    data: [],
    loading: true
  },
  stats: {
    gettPhone: '',
    complianceVerified: false
  }
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...approveReview,
  ...rejectReview,
  ...rejectRequirement,
  ...approveRequirement,
  ...updatePhoneContract,
  ...rhistory,
  ...stats
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
