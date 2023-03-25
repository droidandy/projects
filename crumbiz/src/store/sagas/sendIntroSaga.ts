import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { SendIntroTypes } from '../constants';
import { TemplatesEnum } from '../../types/enums';
import { IOpportunitySummary, ITemplate } from '../../types/interfaces';
import i18n from '../../locale/i18n';
import { OppTargetsEP, TemplatesEP, UtilsEP } from '../../services/api/routes';
import { getUserDataSelector } from '../selectors/authSelector';
import {
	addSavedTemplate,
	setOppData,
	setTemplates,
	updateIntroAction
} from '../actions/sendIntroActions';
import {
	getOppEntities,
	sendIntroSelector
} from '../selectors/sendIntroSelectors';
import {
	extractIdFromResponseHeaders,
	prepareTemplates,
	templateFieldsToOppSummary
} from '../../utils';
import { navigationService } from '../../services';
import oppConnectorsEP from '../../services/api/routes/OppConnectors';
import { createIntroForm } from './utils';
import { ScreensEnum } from '../../navigation/screens';
import { entityDetailsSelector } from '../selectors/entitySelector';
import { handleExistingUserPreferencesSaga } from './entitySaga';

interface ICreateNewTemplatePayload {
	payload: ITemplate;
}

function* prepareTemplatesSaga() {
	try {
		const templatesResponse = yield TemplatesEP.getIntroTemplateFields();
		const oppEntities = yield select(getOppEntities);
		const templates = yield prepareTemplates(templatesResponse, oppEntities);
		yield put(setTemplates(templates));
	} catch (ex) {
		console.log('could not load templates');
	}
}

function* saveNewTemplateSaga({ payload }: ICreateNewTemplatePayload) {
	const userData = yield select(getUserDataSelector);
	const { body, title } = payload;
	try {
		const response = yield TemplatesEP.create({
			templateTypeId: TemplatesEnum.INTRO_TEMPLATE_ID,
			body,
			title,
			creatorUserId: userData.id,
			timestamp: new Date()
		});
		const savedTemplateId = extractIdFromResponseHeaders(response.headers);
		yield put(updateIntroAction('introMessage', { id: savedTemplateId, body }));
		yield put(addSavedTemplate({ body, title, id: savedTemplateId }));
	} catch (error) {
		console.log('Failed saving Template to Server');
	}
}

export function* connectTargetSaga() {
	const { recordingBase64, introMessage, oppData, attachments } = yield select(
		sendIntroSelector
	);
	const entity = yield select(entityDetailsSelector);

	const userData = yield select(getUserDataSelector);
	const { id } = oppData;

	if (entity.id) {
		yield handleExistingUserPreferencesSaga(entity);
	}

	const interactionForm = yield createIntroForm({
		id,
		entity,
		currentUserId: userData.id,
		recordingBase64,
		introMessage,
		attachments
	});

	try {
		yield OppTargetsEP.create(interactionForm);
	} catch (error) {
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: i18n.t('connectEntities.allSet.connectionFailed.header'),
			message: i18n.t('connectEntities.allSet.connectionFailed.text'),
			actionButtonText: i18n.t(
				'connectEntities.allSet.connectionFailed.actionButtonText'
			),
			onActionButtonPress: () =>
				navigationService.navigate(ScreensEnum.NEW_DASHBOARD)
		});
	}
}

function* getOppDetailsAndTemplatesSaga() {
	try {
		const { chosenOppId } = yield select(sendIntroSelector);
		const oppDetailsAndTemplates = yield call(
			oppConnectorsEP.getOppDetailsAndTemplates,
			chosenOppId
		);
		const { opportunity } = oppDetailsAndTemplates[0];
		const oppSummary: Partial<IOpportunitySummary> = templateFieldsToOppSummary(
			opportunity.opportunityTemplates[0].opportunityTemplateFields,
			opportunity.opportunityTypeId
		);

		yield put(updateIntroAction('oppSummary', oppSummary));
		yield put(setOppData(oppDetailsAndTemplates[0]));
	} catch (ex) {
		console.log('Failed getOppDetailsAndTemplatesSaga');
	}
}

export function* watchSendIntroSaga() {
	yield all([
		takeLatest(SendIntroTypes.PREPARE_TEMPLATES as any, prepareTemplatesSaga),
		takeLatest(SendIntroTypes.SAVE_NEW_TEMPLATE as any, saveNewTemplateSaga),

		takeLatest(SendIntroTypes.CONNECT_TARGET as any, connectTargetSaga),
		takeLatest(
			SendIntroTypes.GET_OPP_DETAILS_AND_TEMPLATES as any,
			getOppDetailsAndTemplatesSaga
		)
	]);
}
