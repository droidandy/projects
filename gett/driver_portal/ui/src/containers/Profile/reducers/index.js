import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'
import * as loadStatistic from './loadStatistic'
import * as update from './update'
import * as avatar from './avatar'

export const getInitialState = () => ({
  statistic: {
    stats: {},
    rating: {},
    distance: 0,
    loading: true
  },
  update: {
    loading: false,
    errors: {}
  },
  avatar: {
    loading: false,
    errors: {}
  }
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...loadStatistic,
  ...update,
  ...avatar
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
