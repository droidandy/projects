import { call, put, takeEvery } from "redux-saga/effects"
import { getRequest } from "./api"

import { fetchFontsRequest, fetchFontsSuccess } from "../actions/fonts"

// Fetch all fonts request
function fetchFonts(object) {
  return getRequest(`/fonts?offset=${object.offset}&limit=${object.limit}`)
}

// All fonts
function * fetchFontsWatcher({ payload }) {
  try {
    const fonts = yield call(fetchFonts, payload)

    yield put(fetchFontsSuccess(fonts.data.data.results))
  } catch (e) {
    console.log("Fetch fonts error", e)
  }
}

export default function * fontsWatcher() {
  yield takeEvery(fetchFontsRequest, fetchFontsWatcher)
}
