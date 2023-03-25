import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import request from 'utils/request';
import { push } from 'react-router-redux';
import { success } from 'react-notification-system-redux';
import { BENREVO_API_PATH } from '../../../config';
import * as types from '../constants';
import * as actions from '../actions';
import { updateClient } from '../../Client/actions';
import { selectClient, selectInfoForQuote, selectSummaryLoaded, selectSummaries, selectOption1, selectQuoteIsEasy, selectFiles, selectPreviewFiles, selectOptionType, checkRenewal, selectModUploaded } from '../selectors';

export function* getDates() {
  try {
    const client = yield select(selectClient());
    yield put({ type: types.DATES_SUMMARY_GET });
    yield put({ type: types.DATES_QUOTES_GET });
    const notification = yield call(request, `${BENREVO_API_PATH}/admin/history/notification/${client.id}/EMAIL/QUOTE_READY`);
    const onBoardingNotification = yield call(request, `${BENREVO_API_PATH}/admin/history/notification/${client.id}/EMAIL/ON_BOARDING_APPROVED`);

    yield put({ type: types.DATES_GET_SUCCESS, payload: { notification, onBoardingNotification } });
  } catch (err) {
    yield put({ type: types.DATES_GET_ERROR, payload: err });
  }
}

export function* quoteNetworksGet() {
  try {
    const data = { networks: {}, quotesLatest: { medical: null, kaiser: null, dental: null, vision: null, medicalRenewal: null, dentalRenewal: null, visionRenewal: null }, option1: {} };
    const infoData = yield select(selectInfoForQuote());
    const result = yield call(request, `${BENREVO_API_PATH}/admin/getLatestQuotes/${infoData.client.id}/${infoData.carrier.name}/${types.NEW_BUSINESS_TYPE}`);
    const renewalResult = yield call(request, `${BENREVO_API_PATH}/admin/getLatestQuotes/${infoData.client.id}/${infoData.carrier.name}/${types.RENEWAL_TYPE}`);
    for (let i = 0; i < result.length; i += 1) {
      const item = result[i];
      let category = item.category.toLowerCase();
      if (item.quoteType === 'KAISER' || item.quoteType === 'KAISER_EASY') category = 'kaiser';

      data.networks[category] = item.rfpQuoteNetworks;
      data.quotesLatest[category] = item.rfpQuoteId;
      data.option1[category] = item.currentPlans;
    }

    for (let i = 0; i < renewalResult.length; i += 1) {
      const item = renewalResult[i];
      const category = `${item.category.toLowerCase()}Renewal`;

      data.networks[category] = item.rfpQuoteNetworks;
      data.quotesLatest[category] = item.rfpQuoteId;
      data.option1[category] = item.currentPlans;
    }
    yield put({ type: types.QUOTE_NETWORKS_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.QUOTE_NETWORKS_GET_ERROR, payload: err });
  }
}

export function* getDateSummary() {
  try {
    const client = yield select(selectClient());
    const summary = yield call(request, `${BENREVO_API_PATH}/admin/history/rfpQuoteSummary/${client.id}`);

    yield put({ type: types.DATE_SUMMARY_GET_SUCCESS, payload: { summary } });
  } catch (err) {
    yield put({ type: types.DATE_SUMMARY_GET_ERROR, payload: err });
  }
}

export function* getDateQuotes() {
  try {
    const client = yield select(selectClient());
    const infoData = yield select(selectInfoForQuote());
    const carrier = infoData.carrier.name;
    const quotes = yield call(request, `${BENREVO_API_PATH}/admin/history/rfpQuote/${client.id}/${carrier}`);

    yield put({ type: types.DATES_QUOTES_GET_SUCCESS, payload: { quotes } });
  } catch (err) {
    yield put({ type: types.DATES_QUOTES_GET_ERROR, payload: err });
  }
}

export function* getSummaries() {
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/admin/clients/${client.id}/quotes/summary/`;
    const data = yield call(request, url);
    yield put({ type: types.SUMMARY_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.SUMMARY_GET_ERROR, payload: err });
  }
}

export function* saveSummaries(action) {
  const section = action.payload.section;
  const value = action.payload.value;
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClient());
    const summaries = yield select(selectSummaries());
    const summaryLoaded = yield select(selectSummaryLoaded());
    const url = `${BENREVO_API_PATH}/admin/clients/${client.id}/quotes/summary/`;
    const body = {
      medicalNotes: summaries.medical,
      dentalNotes: summaries.dental,
      medicalWithKaiserNotes: summaries.kaiser,
      visionNotes: summaries.vision,
    };


    if (summaryLoaded) ops.method = 'PUT';

    if (section === 'medical') body.medicalNotes = value;
    else if (section === 'kaiser') body.medicalWithKaiserNotes = value;
    else if (section === 'dental') body.dentalNotes = value;
    else if (section === 'vision') body.visionNotes = value;


    ops.body = JSON.stringify(body);

    const data = yield call(request, url, ops);
    yield put({ type: types.SUMMARY_SAVE_SUCCESS, payload: { data, section } });
  } catch (err) {
    yield put({ type: types.SUMMARY_SAVE_ERROR, payload: err });
  }
}

export function* saveOption1() {
  try {
    const option1 = yield select(selectOption1());
    const url = `${BENREVO_API_PATH}/admin/createOption/`;
    let sent = false;
    for (let i = 0; i < Object.keys(option1).length; i += 1) {
      const item = option1[Object.keys(option1)[i]];
      const ops = {
        method: 'POST',
      };

      if (item.rfpQuoteId && Object.keys(item.network).length) {
        const option1Data = {
          clientPlanToNetwork: item.network,
          category: (Object.keys(option1)[i] === 'kaiser') ? 'MEDICAL' : Object.keys(option1)[i].toUpperCase(),
          rfpQuoteId: item.rfpQuoteId,
          optionType: item.optionType,
        };

        ops.body = JSON.stringify(option1Data);

        yield call(request, url, ops);
        sent = true;
      }
    }

    yield put(actions.getDifference());
    if (sent) {
      const notificationOpts = {
        message: 'Option created successfully',
        position: 'tc',
        autoDismiss: 5,
      };
      yield put(success(notificationOpts));
    }

    yield put({ type: types.OPTION1_SAVE_SUCCESS });
  } catch (err) {
    yield put({ type: types.OPTION1_SAVE_ERROR, payload: err });
  }
}

export function* sendNotification() {
  const ops = {
    method: 'POST',
  };
  try {
    const infoData = yield select(selectInfoForQuote());
    const url = `${BENREVO_API_PATH}/admin/notification/QUOTED/${infoData.client.id}/${infoData.carrier.name}/`;

    const data = yield call(request, url, ops);
    yield put({ type: types.SEND_NOTIFICATION_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.SEND_NOTIFICATION_ERROR, payload: err });
  }
}

export function* approveOnBoarding() {
  const ops = {
    method: 'POST',
  };
  try {
    const infoData = yield select(selectInfoForQuote());
    const url = `${BENREVO_API_PATH}/admin/notification/ON_BOARDING/${infoData.client.id}/${infoData.carrier.name}/`;
    ops.body = JSON.stringify({
      clientState: 'ON_BOARDING',
    });
    const data = yield call(request, url, ops);
    yield put({ type: types.APPROVE_ON_BOARDING_SUCCESS, payload: data });
    yield put(updateClient('clientState', 'ON_BOARDING'));
  } catch (err) {
    yield put({ type: types.APPROVE_ON_BOARDING_ERROR, payload: err });
  }
}

export function* uploadQuote(action) {
  const fileInfo = action.payload;
  const file = fileInfo.file[0];

  try {
    const infoData = yield select(selectInfoForQuote());
    const quoteIsEasy = yield select(selectQuoteIsEasy());
    const files = yield select(selectFiles());
    const category = fileInfo.category;
    const isRenewal = yield select(checkRenewal());
    const ops = {
      method: 'POST',
    };

    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();

    if (file) form.append('file', file);
    if (!file && files.DHMO) form.append('file', files.DHMO);
    if (!file && files.DPPO.length) {
      for (let i = 0; i < files.DPPO.length; i += 1) {
        form.append('file2', files.DPPO[i]);
      }
    }
    ops.body = form;

    if (form.has('file') || form.has('file2')) {
      let url = `${BENREVO_API_PATH}/admin/quotes/${infoData.broker.id}/${infoData.client.id}/${infoData.carrier.name}/${category.toUpperCase()}/`;

      if (quoteIsEasy.kaiser && fileInfo.kaiser) url += 'KAISER_EASY/';
      else if (quoteIsEasy[fileInfo.category]) url += 'EASY/';
      else if (fileInfo.kaiser) url += 'KAISER/';
      else url += 'STANDARD/';

      url += isRenewal;

      if (category === 'modLetter') {
        url = `${BENREVO_API_PATH}/admin/clients/${infoData.client.id}/quotes/summary/upload`;
        const modUploaded = yield select(selectModUploaded());
        if (modUploaded) {
          form.append('override', true);
          ops.body = form;
        }
      }

      const data = yield call(request, url, ops, true);
      yield put({ type: types.UPLOAD_QUOTE_SUCCESS, payload: { info: fileInfo, data } });
      yield put(actions.getClientPlans(infoData.client.id));
      yield put(actions.getQuoteNetworks(fileInfo.category));
    } else yield put({ type: types.UPLOAD_QUOTE_ERROR, payload: fileInfo });
  } catch (err) {
    yield put({ type: types.UPLOAD_QUOTE_ERROR, payload: fileInfo });
  }
}

export function* previewQuote(action) {
  const fileInfo = action.payload;
  const file = fileInfo.file;

  try {
    const infoData = yield select(selectInfoForQuote());
    const quoteIsEasy = yield select(selectQuoteIsEasy());
    const files = yield select(selectPreviewFiles());
    const isRenewal = yield select(checkRenewal());
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();

    if (file) form.append('file', file);
    if (!file && files.DHMO) form.append('file', files.DHMO);
    if (!file && files.DPPO) form.append('file2', files.DPPO);

    ops.body = form;
    if (form.has('file') || form.has('file2')) {
      let url = `${BENREVO_API_PATH}/admin/quotes/changes/${infoData.broker.id}/${infoData.client.id}/${infoData.carrier.name}/${fileInfo.category.toUpperCase()}/`;

      if (quoteIsEasy.kaiser && fileInfo.kaiser) url += 'KAISER_EASY/';
      else if (quoteIsEasy[fileInfo.category]) url += 'EASY/';
      else if (fileInfo.kaiser) url += 'KAISER/';
      else url += 'STANDARD/';

      url += isRenewal;

      const data = yield call(request, url, ops, true);
      yield put({ type: types.PREVIEW_QUOTE_SUCCESS, payload: { data, infoData: fileInfo } });
      yield put(push(`/client/plans/quote-preview/${(fileInfo.kaiser) ? 'kaiser' : fileInfo.category}/`));
    } else yield put({ type: types.PREVIEW_QUOTE_ERROR, payload: fileInfo });
  } catch (err) {
    yield put({ type: types.PREVIEW_QUOTE_ERROR, payload: fileInfo });
  }
}

export function* getDifference() {
  try {
    const client = yield select(selectClient());
    const optionType = yield select(selectOptionType());
    const url = `${BENREVO_API_PATH}/admin/planDifferences?clientId=${client.id}&optionType=${optionType}`;
    const data = yield call(request, url);
    yield put({ type: types.DIFFERENCE_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.DIFFERENCE_GET_ERROR, payload: err });
  }
}

export function* deleteQuote(action) {
  const quoteType = action.payload.quoteType;
  const client = yield select(selectClient());
  try {
    let url = `${BENREVO_API_PATH}/admin/quotes/delete/${client.id}`;
    const ops = {
      method: 'DELETE',
    };
    if (quoteType === 'kaiser') {
      url = `${url}/MEDICAL?quoteType=KAISER`;
    } else {
      url = `${url}/${quoteType.toUpperCase()}?quoteType=STANDARD`;
    }
    yield call(request, url, ops, false, 'Successfully deleted quote.');
    yield put({ type: types.DELETE_QUOTE_SUCCESS, payload: { quoteType } });

    yield put(actions.getQuoteNetworks(quoteType));
  } catch (err) {
    yield put({ type: types.DELETE_QUOTE_ERROR, payload: { quoteType, err } });
  }
}

export function* uploadMedicalExists(action) {
  const fileInfo = action.payload;
  const overwrite = fileInfo.overwrite;
  const filesToUpload = fileInfo.file;
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClient());
    const infoData = yield select(selectInfoForQuote());
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    const dto = {
      quoteType: 'STANDARD',
      category: 'MEDICAL',
      renewal: true,
      addToExisted: !overwrite,
    };
    if (filesToUpload && filesToUpload.length) {
      for (let i = 0; i < filesToUpload.length; i += 1) {
        form.append('files', filesToUpload[i]);
      }
    }
    form.append('dto', JSON.stringify(dto));
    ops.body = form;
    const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}`;
    const data = yield call(request, url, ops, true, 'Files uploaded successfully');
    yield put({ type: types.UPLOAD_QUOTE_SUCCESS, payload: { info: fileInfo, data } });
    yield put(actions.getClientPlans(infoData.client.id));
    yield put(actions.getQuoteNetworks(fileInfo.category));
  } catch (error) {
    yield put({ type: types.UPLOAD_QUOTE_ERROR, payload: fileInfo });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.QUOTE_NETWORKS_GET, quoteNetworksGet);
  yield takeLatest(types.SUMMARY_GET, getSummaries);
  yield takeLatest(types.DATES_SUMMARY_GET, getDateSummary);
  yield takeLatest(types.DATES_QUOTES_GET, getDateQuotes);
  yield takeLatest(types.DATES_GET, getDates);
  yield takeLatest(types.SUMMARY_SAVE, saveSummaries);
  yield takeLatest(types.OPTION1_SAVE, saveOption1);
  yield takeEvery(types.UPLOAD_QUOTE, uploadQuote);
  yield takeEvery(types.PREVIEW_QUOTE, previewQuote);
  yield takeLatest(types.SEND_NOTIFICATION, sendNotification);
  yield takeLatest(types.APPROVE_ON_BOARDING, approveOnBoarding);
  yield takeLatest(types.DIFFERENCE_GET, getDifference);
  yield takeLatest(types.DELETE_QUOTE, deleteQuote);
  yield takeLatest(types.CHANGE_SELECTED_QUOTE_TYPE, getDifference);
  yield takeLatest(types.UPLOAD_MEDICAL_EXISTS, uploadMedicalExists);
}

// All sagas to be loaded
export default [
  watchFetchData,
];
