import { composeReducer } from 'redux-compose-reducer'
import { get } from 'lodash'
import { NAMESPACE } from '../actions'
import * as load from './load'
import * as save from './save'
import * as uploadImage from './uploadImage'

export const getInitialState = () => ({
  news: {
    loading: false
  },
  imageInsert: {}
})

export default composeReducer(NAMESPACE, {
  initialize: () => getInitialState(),
  ...load,
  ...save,
  ...uploadImage
}, getInitialState())

export const mapStateToProps = (state) => {
  return get(state, NAMESPACE)
}
