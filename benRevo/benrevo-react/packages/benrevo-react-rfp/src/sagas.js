import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import { warning } from 'react-notification-system-redux';
import {
  SEND_RFP, SEND_RFP_TO_CARRIER_SUCCESS, SEND_RFP_TO_CARRIER_ERROR,
  FETCH_RFP, FETCH_RFP_SUCCEEDED, FETCH_RFP_FAILED,
  SEND_RFP_FILE, UPDATE_FILES, SEND_RFP_FILE_ERROR, RESET_RFP_STATE,
  FETCH_RFP_PDF, FETCH_RFP_PDF_SUCCESS, FETCH_RFP_PDF_ERROR, CHANGE_CURRENT_CARRIER,
  CHECK_CENSUS_TYPE, CHECK_CENSUS_TYPE_SUCCESS, CHECK_CENSUS_TYPE_ERROR,
  REMOVE_FILE, REMOVE_PLAN_FILE, REMOVE_RFP_FILE_SUCCESS, REMOVE_RFP_FILE_ERROR, REMOVE_FILE_UI, REMOVE_PLAN_FILE_UI,
  FETCH_CARRIERS, FETCH_CARRIERS_SUCCEEDED, FETCH_CARRIERS_FAILED,
  NETWORKS_GET_SUCCESS, NETWORKS_GET_ERROR,
  RFP_PLANS_SAVE, RFP_PLANS_SAVE_SUCCESS, RFP_PLANS_SAVE_ERROR,
  RFP_MEDICAL_SECTION, RFP_DENTAL_SECTION, RFP_VISION_SECTION, RFP_LIFE_SECTION, RFP_STD_SECTION, RFP_LTD_SECTION,
  RFP_PLANS_GET_SUCCESS,
} from './constants';
import {
  selectRfpRequest,
  selectClientRequest,
  selectRfpState,
  updateRfpState,
  selectFilesRequest,
  selectFilesResponse,
  selectFileId,
  selectAllCarriers,
  selectRfpPlans,
  selectNetworksLoading,
  selectPendingSave,
} from './selectors';
import { setPendingPlans, sendRfp, updatePlanLoaded } from './actions';

export function* saveRfp() {
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClientRequest());
    const networksLoadingMedical = yield select(selectNetworksLoading(RFP_MEDICAL_SECTION));
    const networksLoadingDental = yield select(selectNetworksLoading(RFP_DENTAL_SECTION));
    const networksLoadingVision = yield select(selectNetworksLoading(RFP_VISION_SECTION));

    if (networksLoadingMedical.size > 0 || networksLoadingDental.size > 0 || networksLoadingVision.size > 0) {
      yield put(setPendingPlans());
      return;
    }
    if (!client.id) {
      const notificationOpts = {
        message: 'First you need to create a client',
        position: 'tc',
        autoDismiss: 5,
        uid: 1111,
      };
      yield put(warning(notificationOpts));
      throw new Error('No Client Id found');
    }
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/rfps`;
    const rfp = yield select(selectRfpRequest());
    const rfpData = rfp.data;
    const toPUT = [];
    const toPOST = [];
    let data = [];

    for (let i = 0; i < rfpData.length; i += 1) {
      const item = rfpData[i];
      if (item.id) toPUT.push(item);
      else toPOST.push(item);
    }

    if (toPOST.length) {
      ops.body = JSON.stringify(toPOST);
      ops.headers = new Headers();
      ops.headers.append('content-type', 'application/json;charset=UTF-8');

      const result = yield call(request, url, ops);

      data = data.concat(result);
    }

    if (toPUT.length) {
      ops.method = 'PUT';
      ops.body = JSON.stringify(toPUT);
      ops.headers = new Headers();
      ops.headers.append('content-type', 'application/json;charset=UTF-8');

      const result = yield call(request, url, ops);

      data = data.concat(result);
    }

    data = yield select(updateRfpState(data));
    const jsData = data.rfp.toJS();

    yield put({ type: SEND_RFP_TO_CARRIER_SUCCESS, payload: { data: data.rfp, loading: false } });
    const files = yield select(selectFilesRequest());
    if (files && files.length > 0) {
      yield put({ type: SEND_RFP_FILE, payload: files });
    }

    yield put(updatePlanLoaded(false));
    for (let i = 0; i < rfpData.length; i += 1) {
      const item = rfpData[i];
      const section = item.product.toLowerCase();
      if (section === RFP_MEDICAL_SECTION || section === RFP_DENTAL_SECTION || section === RFP_VISION_SECTION) {
        for (let m = 0; m < item.options.length; m += 1) {
          const itemOption = item.options[m];
          if (!itemOption.id && jsData[section]) itemOption.id = jsData[section].plans[m].id;
        }
        yield put({ type: RFP_PLANS_SAVE, meta: { section }, data: { plans: item.options } });
      } else if (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION) {
        const ancillaryPlans = [];

        if (item.basicPlan) ancillaryPlans.push(item.basicPlan);
        if (item.voluntaryPlan) ancillaryPlans.push(item.voluntaryPlan);

        yield put({ type: RFP_PLANS_SAVE, meta: { section }, data: { plans: ancillaryPlans, rfpId: item.id } });
        // yield put(saveAncillaryPlans(section, ancillaryPlans, item.id));
      }
    }
    yield put(updatePlanLoaded(true));
  } catch (error) {
    yield put({ type: SEND_RFP_TO_CARRIER_ERROR, payload: error });
  }
}

export function* saveRfpPlans(action) {
  const section = action.meta.section;
  const plans = action.data.plans;
  const rfpId = action.data.rfpId;
  const ops = {
    method: 'POST',
  };
  try {
    let url = '';
    if (section === RFP_MEDICAL_SECTION || section === RFP_DENTAL_SECTION || section === RFP_VISION_SECTION) {
      const info = yield select(selectRfpPlans(action.meta.section, plans));
      url = `${BENREVO_API_PATH}/v1/plans/rfp/${info.rfpId}/create`;

      if (info.plans.length) {
        ops.body = JSON.stringify(info.plans);
        yield call(request, url, ops);

        yield put({ type: RFP_PLANS_SAVE_SUCCESS, payload: plans, meta: action.meta });
      }
    } else if (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION) {
      url = `${BENREVO_API_PATH}/v1/plans/rfp/${rfpId}/createAncillary`;

      if (plans.length) {
        ops.body = JSON.stringify(plans);
        const data = yield call(request, url, ops);

        yield put({ type: RFP_PLANS_SAVE_SUCCESS, payload: data, meta: action.meta });
      }
    }
  } catch (error) {
    yield put({ type: RFP_PLANS_SAVE_ERROR, payload: error, meta: action.meta });
  }
}

export function* checkCensusType() {
  const ops = {
    method: 'GET',
  };
  try {
    const client = yield select(selectClientRequest());
    if (!client.id) throw new Error('No Client Id found'); // todo ford handle this better.
    const checkUrl = `${BENREVO_API_PATH}/v1/rfps/census?clientId=${client.id}`;
    const data = yield call(request, checkUrl, ops);
    yield put({ type: CHECK_CENSUS_TYPE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: CHECK_CENSUS_TYPE_ERROR, payload: error });
  }
}

export function* getRfp(action) {
  const url = `${BENREVO_API_PATH}/v1/clients/${action.id}/rfps`;
  const ops = {
    method: 'GET',
  };
  const plans = { medical: [], dental: [], vision: [], life: [], std: [], ltd: [] };
  try {
    const data = yield call(request, url, ops);
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        const section = item.product.toLowerCase();
        if (item.id && (section === RFP_MEDICAL_SECTION || section === RFP_DENTAL_SECTION || section === RFP_VISION_SECTION)) {
          ops.headers = new Headers();
          ops.headers.append('content-type', 'application/json;charset=UTF-8');
          plans[section] = yield call(request, `${BENREVO_API_PATH}/v1/plans/rfp/${item.id}`, ops);
        } else if (item.id && (section === RFP_LIFE_SECTION || section === RFP_STD_SECTION || section === RFP_LTD_SECTION)) {
          ops.headers = new Headers();
          ops.headers.append('content-type', 'application/json;charset=UTF-8');
          plans[section] = yield call(request, `${BENREVO_API_PATH}/v1/plans/rfp/${item.id}/getAncillary`, ops);
        }
      }

      const finalData = yield select(selectRfpState(data, plans));
      yield put({ type: FETCH_RFP_SUCCEEDED, payload: finalData.rfp });

      if (finalData.files) {
        yield put({ type: UPDATE_FILES, payload: finalData.files });
      }

      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        const section = item.product.toLowerCase();

        for (let j = 0; j < item.options.length; j += 1) {
          const option = item.options[j];
          for (let m = 0; m < plans[section].length; m += 1) {
            const plan = plans[section][m];

            if (plan.optionId === option.id && plan.carrierId) {
              yield call(getPlanNetworks, {
                meta: {
                  section,
                },
                payload: { carrierId: plan.carrierId, index: j, planType: option.planType },
              });
            }
          }
        }
      }
      yield put({ type: RFP_PLANS_GET_SUCCESS, payload: { plans: plans[RFP_MEDICAL_SECTION], clientPlans: finalData.rfp.get(RFP_MEDICAL_SECTION).get('plans').toJS() }, meta: { section: RFP_MEDICAL_SECTION } });
      yield put({ type: RFP_PLANS_GET_SUCCESS, payload: { plans: plans[RFP_DENTAL_SECTION], clientPlans: finalData.rfp.get(RFP_DENTAL_SECTION).get('plans').toJS() }, meta: { section: RFP_DENTAL_SECTION } });
    } else {
      yield put({ type: RESET_RFP_STATE });
    }
    yield put(updatePlanLoaded(true));
  } catch (error) {
    yield put({ type: FETCH_RFP_FAILED, payload: error });
  }
}

export function* getAllCarriers() {
  const url = `${BENREVO_API_PATH}/v1/carriers/product/all`;
  const ops = {
    method: 'GET',
  };
  try {
    let data = yield call(request, url, ops);

    data = yield select(selectAllCarriers(data));
    yield put({ type: FETCH_CARRIERS_SUCCEEDED, payload: data });
  } catch (error) {
    yield put({ type: FETCH_CARRIERS_FAILED, payload: error });
  }
}

export function* uploadFile(action) {
  try {
    const files = action.payload;
    const state = yield select();
    const fileRequest = [];

    if (files && Array.isArray(files)) {
      /* eslint-disable no-plusplus */
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let id = null;
        const ops = {
          method: 'POST',
        };
        ops.headers = new Headers();
        ops.headers.append('Accept', 'application/json');
        const form = new FormData();
        if (file && file.section) {
          form.append('file', file, file.name);
          ops.body = form;
          id = state.get('rfp').get(file.section).get('id');
          if (id) {
            const data = yield call(request, `${BENREVO_API_PATH}/v1/rfp/${id}/files/${file.field}/upload`, ops, true);
            fileRequest.push({ file: data, section: file.section, index: file.index });
          }
        }
      }// end loop
      const res = yield select(selectFilesResponse(fileRequest));

      yield put({ type: UPDATE_FILES, payload: res });
    } // end check on files
  } catch (error) {
    yield put({ type: SEND_RFP_FILE_ERROR, payload: error });
  }
}

export function* removeFile(action) {
  const section = action.meta.section;
  const ops = {
    method: 'DELETE',
  };

  try {
    const fileId = yield select(selectFileId(action.payload, section));

    if (action.payload.name) yield put({ type: REMOVE_FILE_UI, payload: action.payload, meta: { section } });
    else yield put({ type: REMOVE_PLAN_FILE_UI, payload: action.payload, meta: { section } });

    if (fileId) {
      const url = `${BENREVO_API_PATH}/v1/file/${fileId}`;

      const data = yield call(request, url, ops);

      yield put({ type: REMOVE_RFP_FILE_SUCCESS, payload: data, meta: { section } });
    }
  } catch (error) {
    yield put({ type: REMOVE_RFP_FILE_ERROR, payload: error, meta: { section } });
  }
}

export function* getPdf() {
  const ops = {
    method: 'GET',
  };
  try {
    const client = yield select(selectClientRequest());
    if (!client.id) throw new Error('No Client Id found');

    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/rfps/all/pdf/`;

    const data = yield call(request, url, ops, true);

    yield put({ type: FETCH_RFP_PDF_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: FETCH_RFP_PDF_ERROR, payload: error });
  }
}

export function* getPlanNetworks(action) {
  const info = action.payload;
  try {
    if (info.carrierId) {
      const url = `${BENREVO_API_PATH}/v1/carrier/${info.carrierId}/network/${(info.planType === 'H.S.A') ? 'HSA' : info.planType}/all/`;
      const data = yield call(request, url);
      yield put({ type: NETWORKS_GET_SUCCESS, payload: { data, index: info.index }, meta: action.meta });
      const networksLoading = yield select(selectNetworksLoading(action.meta.section));
      const pendingSave = yield select(selectPendingSave);
      if (pendingSave && !networksLoading.size) {
        yield put(sendRfp());
      }
    }
  } catch (error) {
    yield put({ type: NETWORKS_GET_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(FETCH_CARRIERS, getAllCarriers);
  yield takeLatest(SEND_RFP, saveRfp);
  yield takeLatest(FETCH_RFP, getRfp);
  yield takeLatest(SEND_RFP_FILE, uploadFile);
  yield takeLatest(REMOVE_FILE, removeFile);
  yield takeLatest(REMOVE_PLAN_FILE, removeFile);
  yield takeEvery(FETCH_RFP_PDF, getPdf);
  yield takeEvery(CHECK_CENSUS_TYPE, checkCensusType);
  yield takeEvery(RFP_PLANS_SAVE, saveRfpPlans);
  yield takeEvery(CHANGE_CURRENT_CARRIER, getPlanNetworks);
}

export default [
  watchFetchData,
];
