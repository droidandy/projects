import { call, put, takeEvery, select } from "redux-saga/effects"
import { getRequest } from "./api"
import history from "../history"

import {
  fetchApplicationsRequest,
  fetchApplicationsSuccess
} from "../actions/applications"

// Fetch all applications request
function fetchApplications() {
  return getRequest("/apps")
}

const getUserId = (state) => state.sessions.id
const trackAppsCount = (apps_count, userId) => {
  if (window.analytics) {
    window.segmentHelper.identify(
      userId,
      {
        apps_count
      },
      {
        integrations: {
          All: true,
          Webhooks: false
        }
      }
    )
  }
}

// All applications

function * fetchApplicationsWatcher({ payload }) {
  try {
    const userId = yield select(getUserId)
    const applications = yield call(fetchApplications)
    const allowedPath =
      history.location.pathname.indexOf("/profile") > -1 ||
      history.location.pathname.indexOf("/newapp") > -1

    yield put(fetchApplicationsSuccess(applications.data.data.results))
    yield payload[0](applications.data.data.results)
    yield trackAppsCount(applications.data.data.results.length, userId)

    if (
      applications.data.data.results.length === 0 &&
      !allowedPath &&
      !payload[2]
    ) { history.push("/newapp") }
  } catch (e) {
    yield payload[1](e)
    console.log("Fetch applications error", e)
  }
}

export default function * applicationsWatcher() {
  yield takeEvery(fetchApplicationsRequest, fetchApplicationsWatcher)
}
