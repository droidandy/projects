import { call, put, select, takeEvery } from "redux-saga/effects";
import { getRequest, postRequest, deleteRequest, putRequest } from "./api";

import {
  fetchApplicationRequest,
  fetchApplicationSuccess,
  createApplicationRequest,
  createApplicationSuccess,
  removeApplicationRequest,
  removeApplicationSuccess,
  updateApplicationRequest,
  updateApplicationSuccess,
  updateDashboardsRequest,
  updateDashboardsSuccess, updateConversionsDashboardRequest, updateConversionsDashboardSuccess
} from "../actions/application";
import DashboardApi from "../containers/Container/Dashboard/DashboardApi";
import {getDateFromURI} from "../libs/helpers";

// Fetch one application request
function fetchApplication(applicationId) {
  return getRequest(`/apps/${applicationId}`);
}

// Fetch one dashboard request
function fetchDashboardNowData(appId, platform) {
  return DashboardApi.getNowDashboards(appId, platform).catch(() => {});
}

function fetchDashboardRangeData(appId, filter, timezone, platform) {
  return DashboardApi.getRangeDashboards(appId, filter.start_time, filter.end_time, timezone, platform).catch(() => {});
}

function fetchConversionsDashboardRangeData(appId, filter, timezone, platform) {
  return DashboardApi.getConversions(appId, filter.start_time, filter.end_time, timezone, platform).catch(() => {});
}

// Create application request
function createApplication(application) {
  return postRequest("/apps", application);
}

// Update application request
function updateApplication({ data, isFile }) {
  if (!isFile) {
    delete data.apns_auth_key;
    delete data.apple_subscription_key;
  }
  return putRequest(`/apps/${data.id}`, data);
}

// Destroy application request
function removeApplication(application) {
  return deleteRequest(
    `/apps/${application.id}?bundle_id=${application.bundle_id}`
  );
}

// One application
function* fetchApplicationWatcher(props) {
  const { payload } = props;
  try {
    const timezone = yield select((state) => state?.settings?.timezone)
    const platform = yield select((state) => state.settings.platform)
    const period = getDateFromURI("dashboard");
    const application = yield call(fetchApplication, payload[0]);
    const dashboardNowData = yield call(fetchDashboardNowData, payload[0], platform);
    const dashboardRangeData = yield call(fetchDashboardRangeData, payload[0], period, timezone, platform );
    yield call(updateConversionsState, payload[0], period, timezone, platform);

    yield put(fetchApplicationSuccess({
      ...application.data.data.results,
      dashboards: {
        now: dashboardNowData?.data,
        range: dashboardRangeData?.data
      }
    }));

    yield payload[1](application.data.data.results);

    const event = new Event("apphud.appRequested");
    yield document.dispatchEvent(event);

    yield localStorage.setItem(
      "lastApplicationId",
      application.data.data.results.id
    );
  } catch (e) {
    payload[2]();
    console.log("Fetch applications error", e);
  }
}

// Update application
function* updateApplicationWatcher({ payload }) {
  try {
    const application = yield call(updateApplication, {
      data: payload[0],
      isFile: payload[3]
    });

    yield put(updateApplicationSuccess(application.data.data.results));
    yield payload[1](application.data.data.results);
  } catch (e) {
    payload[2]();
    console.log("Update application error", e);
  }
}

// Remove application
function* removeApplicationWatcher({ payload }) {
  try {
    const application = yield call(removeApplication, payload[0]);

    yield put(removeApplicationSuccess(application.data.data.results));
    yield payload[1]();
  } catch (e) {
    console.log("Fetch applications error", e);
  }
}

// Create application
function* createApplicationWatcher({ payload }) {
  const callback = payload[1];
  try {
    const application = yield call(createApplication, payload[0]);
    yield put(createApplicationSuccess(application.data.data.results));
    yield callback(application.data.data.results);
  } catch (e) {
    console.log("Create application error", e);
  }
}

function* createDashboardWatcher({ payload }) {
  const platform = yield select((state) => state.settings.platform)
  const timezone = yield select((state) => state?.settings?.timezone)
  const dashboardNowData = yield call(fetchDashboardNowData, payload[0], platform);
  const dashboardRangeData = yield call(fetchDashboardRangeData, payload[0], payload[1], timezone, platform)
  yield put(updateDashboardsSuccess({
    dashboards: {
      now: dashboardNowData?.data,
      range: dashboardRangeData?.data
    }
  }));
}

function* createConversionsDashboardWatcher({  payload }) {
  const platform = yield select((state) => state.settings.platform)
  const timezone = yield select((state) => state?.settings?.timezone)
  yield call(updateConversionsState, payload[0], payload[1], timezone, platform);
}

function * updateConversionsState(appId, filter, timezone, platform) {
  const res = yield call(fetchConversionsDashboardRangeData, appId, filter, timezone, platform);
  yield put(updateConversionsDashboardSuccess({
    conversions: {
      ...res.data,
      items: res.data.items.map((group) => {
        const root = group.values[0];
        return {
          ...group,
          values: group.values.map((el) => {
            return {
              ...el,
              percent: root.value > 0 ? Number((100 / root.value) * el.value) : 0
            };
          })
        }
      })
    }
  }));
}

export default function* applicationWatcher() {
  yield takeEvery(fetchApplicationRequest, fetchApplicationWatcher);
  yield takeEvery(createApplicationRequest, createApplicationWatcher);
  yield takeEvery(removeApplicationRequest, removeApplicationWatcher);
  yield takeEvery(updateApplicationRequest, updateApplicationWatcher);
  yield takeEvery(updateDashboardsRequest, createDashboardWatcher);
  yield takeEvery(updateConversionsDashboardRequest, createConversionsDashboardWatcher);
}
