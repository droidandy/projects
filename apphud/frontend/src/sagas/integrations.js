import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import {
  fetchIntegrationsRequest,
  fetchIntegrationsSuccess
} from "../actions/integrations"

// Fetch all integrations request

function fetchIntegrations(data) {
  return getRequest(`/apps/${data.appId}/integrations?platform=${data.platform}`)
}

// All integrations

function * fetchIntegrationsWatcher({ payload }) {
  try {
    const integrations = yield call(fetchIntegrations, payload[0])

    yield put(fetchIntegrationsSuccess(integrations.data.data.results))
    yield payload[1](integrations.data.data.results)
  } catch (e) {
    console.log("Fetch integrations error", e)
  }
}

export default function * integrationsWatcher() {
  yield takeEvery(fetchIntegrationsRequest, fetchIntegrationsWatcher)
}
