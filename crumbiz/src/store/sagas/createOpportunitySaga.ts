import { put, all, takeLatest, select, call } from 'redux-saga/effects';
import { CreateOpportunityTypes } from '../constants';
import { navigationService } from '../../services';
import { createOpportunitySelector } from '../selectors/createOpportunitySelectors';
import { ICreateOpInitialState } from '../reducers/createOpportunityReducer';
import {
	getAuthStateSelector,
	getUserDataSelector
} from '../selectors/authSelector';
import {
	opportunitiesEP,
	TemplateFieldsEP,
	OppTypesEP
} from '../../services/api/routes';
import { TemplatesEnum, EntityEnum } from '../../types/enums';
import { extractIdFromResponseHeaders } from '../../utils';
import { createNewOppForm } from './utils';

import oppConnectorsEP from '../../services/api/routes/OppConnectors';
import {
	addNewConnectorError,
	addNewConnectorSuccess,
	resetCreateOppState,
	setOppTemplateField,
	submitOpportunityError,
	submitOpportunitySuccess
} from '../actions/createOpportunityActions';
import { resetOppOverviewState } from '../actions/oppOverviewActions';
import { setOppTypes } from '../actions/createOpportunityActions';
import {
	IPayload,
	IOppTemplateFieldPayload,
	PlainFunction
} from '../../types/interfaces';

import {
	setNewOppForModal,
	setSelectedOppAndRole
} from '../actions/oppOverviewActions';
import {
	oppOverviewSelector,
	IOppOverViewSelector
} from '../selectors/oppOverviewSelector';
import { ScreensEnum } from '../../navigation/screens';
import { entityDetailsSelector } from '../selectors/entitySelector';
import { IEntity } from '../../types/interfaces';
import { handleExistingUserPreferencesSaga } from './entitySaga';
import createNewconnectorForm from './utils/createNewConnectorForm';
import { resetEntityState } from '../actions/entityActions';
import afterTwoTicks from '../../utils/afterTwoTicks';

export interface ITemplate {
	[key: string]: { id: string; title: string }[];
}
function* getOppTypes() {
	try {
		const oppTypes = yield call(OppTypesEP.getAll);
		yield put(setOppTypes(oppTypes.value));
	} catch (ex) {
		console.log('Error fetching OppTypes', ex);
	}
}

function* getOppTemplateFieldSaga({ payload }: IPayload<TemplatesEnum>) {
	try {
		const templateArray = yield call(
			TemplateFieldsEP.getOppTemplateFields,
			payload
		);
		const templateData = templateArray.value[0];
		const templateField: IOppTemplateFieldPayload = {
			key: payload,
			value: JSON.parse(templateData.lookupData)
		};

		yield put(setOppTemplateField(templateField));
	} catch (ex) {
		console.log('Error fetching getOppTemplateFieldSaga', ex);
	}
}

function* submitOpportunity({ payload: callback }: IPayload<PlainFunction>) {
	const {
		verticals,
		opTitle,
		opType,
		businessType,
		provider,
		budget,
		role,
		msgTextToEntity
	} = yield select(createOpportunitySelector);
	const { userData } = yield select(getAuthStateSelector);
	const entity: IEntity = yield select(entityDetailsSelector);
	if (entity.id) {
		yield handleExistingUserPreferencesSaga(entity);
	}

	const data = createNewOppForm({
		role,
		entity,
		currentUserId: userData.id,
		msgTextToEntity,
		verticals,
		opTitle,
		oppTypeId: opType.id,
		businessTypeId: businessType.id,
		providerId: provider.id,
		budget
	});

	try {
		const createOppResponse = yield opportunitiesEP.create(data);
		const newOppId = extractIdFromResponseHeaders(createOppResponse.headers);

		yield put(resetOppOverviewState());
		yield put(setNewOppForModal());
		yield put(setSelectedOppAndRole({ role: role!, oppId: newOppId }));
		yield callback();
		yield navigationService.navigate(ScreensEnum.OPP_OVERVIEW);
		yield put(resetCreateOppState());
		yield put(submitOpportunitySuccess());
	} catch (error) {
		yield put(submitOpportunityError());
		console.log(`Error Posting Opportunities ${error}`);
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: 'Something went wrong',
			message: 'Please try again in few minutes.',
			onActionButtonPress: () => {
				callback();
				navigationService.navigate(ScreensEnum.NEW_DASHBOARD);
			}
		});
	}
}

function* addNewConnectorSaga({ payload: callback }: IPayload<PlainFunction>) {
	const { oppDetails }: IOppOverViewSelector = yield select(
		oppOverviewSelector
	);
	const { msgTextToEntity }: ICreateOpInitialState = yield select(
		createOpportunitySelector
	);
	const entity = yield select(entityDetailsSelector);
	const userData = yield select(getUserDataSelector);

	if (entity.id) {
		yield handleExistingUserPreferencesSaga(entity);
	}

	try {
		const data = createNewconnectorForm({
			entity,
			userId: userData.id,
			oppId: oppDetails.oppId,
			msgTextToEntity
		});

		yield oppConnectorsEP.create(data);
		yield callback();
		yield all([
			put(resetCreateOppState()),
			put(resetOppOverviewState()),
			put(
				setSelectedOppAndRole({
					oppId: oppDetails.oppId,
					role: EntityEnum.OWNER
				})
			)
		]);

		yield put(addNewConnectorSuccess());
		navigationService.navigate(ScreensEnum.OPP_OVERVIEW);
	} catch (ex) {
		yield put(addNewConnectorError());
		console.log('Failed addNewConnectorSaga', ex);
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: 'Something went wrong',
			message: 'Please try again in few minutes',
			onActionButtonPress: () => {
				navigationService.navigate(ScreensEnum.NEW_DASHBOARD);
			}
		});
	}
}

export function* watchCreateOppSaga() {
	yield all([
		takeLatest(
			CreateOpportunityTypes.SUBMIT_OPPORTUNITY as any,
			submitOpportunity
		),
		takeLatest(
			CreateOpportunityTypes.ADD_NEW_CONNECTOR as any,
			addNewConnectorSaga
		),
		takeLatest(
			CreateOpportunityTypes.GET_TEMPLATE_FIELD as any,
			getOppTemplateFieldSaga
		),
		takeLatest(CreateOpportunityTypes.GET_OPP_TYPES as any, getOppTypes)
	]);
}
