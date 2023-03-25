import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"
import $ from "jquery"

import { fetchEventsRequest, fetchEventsSuccess } from "../actions/events"

// Fetch all events request
function fetchEvents(_data) {
  const data = JSON.parse(JSON.stringify(_data))
  const { userId } = data

  delete data.userId

  const queryString = $.param(data)

  return getRequest(`/apps/customers/${userId}/events?${queryString}`)
}

// All events

function * fetchEventsWatcher({ payload }) {
  try {
    const events = yield call(fetchEvents, payload[0])

    yield put(fetchEventsSuccess(events.data.data.results))
    yield payload[1](events.data.data.results)
  } catch (e) {
    console.log("Fetch events error", e)
  }
}

export default function * eventsWatcher() {
  yield takeEvery(fetchEventsRequest, fetchEventsWatcher)
}
