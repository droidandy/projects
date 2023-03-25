// import { push } from 'connected-react-router';
import { call, put } from 'redux-saga/effects';

import { setBusy } from '~/store/appReducer';

/**
 * Utility generator function to make a simple async API call.
 * It will show/hide a spinner when busy, perform the APIcall, and trigger the success/error action
 * @param {*} apiCall       The API to make
 * @param {*} body          The body of the API request
 * @param {*} successAction The action to call when the API call succeeds
 * @param {*} errorAction   The action to call when the API call fails
 * @param {*} successNextPage   Where to go next if no error thrown
 */
export function* asyncRequest(apiCall, body, successAction, errorAction, successNextPage = null) {
  try {
    yield put(setBusy(true));
    const result = yield call(apiCall, body);
    if (successAction) {
      yield put(successAction(result));
    }
    if (successNextPage) {
      // yield put(push(successNextPage));
    }
    yield put(setBusy(false));
    return result;
  } catch (err) {
    if (errorAction) {
      yield put(errorAction(err));
    }
    yield put(setBusy(false));
  }
}
