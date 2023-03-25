import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './authSaga';
import { watchCreateOppSaga } from './createOpportunitySaga';
import { watchSendIntroSaga } from './sendIntroSaga';
import { watchOppOverviewSaga } from './oppOverviewSaga';
import { watchCrumbizUsersSaga } from './crumbizUsersSaga';
import { watchMyOppsSaga } from './myOppsSaga';
import { watchInteractionsSaga } from './interactionsSaga';
import { watchEntitySaga } from './entitySaga';
import { createRequestInstance, watchRequests } from 'redux-saga-requests';
import { createDriver } from 'redux-saga-requests-axios';
import crumbizApi from '../../services/api/crumbizInstance';

function* sagaRequestsMiddleware() {
	yield createRequestInstance({ driver: createDriver(crumbizApi) });
	yield watchRequests();
}

export default function* rootSaga() {
	yield all([
		sagaRequestsMiddleware(),
		watchAuthSaga(),
		watchCreateOppSaga(),
		watchSendIntroSaga(),
		watchInteractionsSaga(),
		watchOppOverviewSaga(),
		watchCrumbizUsersSaga(),
		watchMyOppsSaga(),
		watchEntitySaga()
	]);
}
