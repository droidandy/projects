import { call, put } from 'redux-saga/effects'
import api from 'api'
import { loadStatsSuccess, loadRatingSuccess, loadDistanceSuccess } from '../actions'
import { showSystemMessage } from 'containers/App/actions'

function * loadStats() {
  try {
    const { data } = yield call(api().get, '/session/stats')
    yield put(loadStatsSuccess({ stats: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

function * loadRating() {
  try {
    const { data } = yield call(api().get, '/session/metrics')
    yield put(loadRatingSuccess({ rating: data }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

function * loadDistance() {
  try {
    const { data: { distance } } = yield call(api().get, '/session/total_distance')
    yield put(loadDistanceSuccess({ distance }))
  } catch (error) {
    const { response: { data: { errors } } } = error
    if (errors.data) {
      yield put(showSystemMessage({
        kind: 'error',
        text: errors.data
      }))
    }
  }
}

export {
  loadStats,
  loadRating,
  loadDistance
}
