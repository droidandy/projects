import { put, all, takeLatest, select, call } from 'redux-saga/effects';
import {
	IUserData,
	IAssociatedOppsSection,
	IGetTargetsPayload,
	IOppConnectorsExpandedWithTargets,
	IOppConnectorDetails,
	IOppTargetDetails,
	IOppFullDetails,
	IChangeTargetStatusPayload,
	ISendInteractionPayload,
	IOppDetailsAndUsers,
	ITemplate,
	ISingleOppInList,
	IChangeEntityDecisionPayload,
	ISpecialInteractionPayload
} from '../../types/interfaces';

import {
	templateFieldsToOppSummary,
	removeHTMLTags,
	createInteractionBody,
	extractAvatarFromUser
} from '../../utils';
import {
	setAssociatedOpps,
	setTargetsAndConnectors,
	setOppSummary,
	setOppDetails,
	updateTargetStatusId,
	updateOppStatus,
	setPredefinedQuestions,
	setNewOppData,
	updateTargetStatusInsideProfile,
	getOppDetailsTargetsAndConnectorsSuccess,
	getOppDetailsTargetsAndConnectorsError
} from '../actions/oppOverviewActions';
import { OppOverviewTypes } from '../constants';
import {
	EntityEnum,
	OpportunityStatusesEnum,
	TargetStatusesEnum,
	InteractionTypesEnum,
	InteractionStatuses,
	IntSubResponseTypesEnum,
	InteractionTemplateFieldsEnum,
	SpacielInteractionsTypeEnum
} from '../../types/enums';
import {
	OppConnectorsEP,
	OppTemplateFieldsEP,
	OppTargetsEP,
	opportunitiesEP,
	TemplatesEP,
	InteractionsEP
} from '../../services/api/routes';
import {
	getUserDataSelector,
	getAuthStateSelector
} from '../selectors/authSelector';
import {
	oppOverviewSelector,
	IOppOverViewSelector,
	roleSelector
} from '../../store/selectors/oppOverviewSelector';
import { IAssociatedOpp, IPayload } from '../../types/interfaces';
import _get from 'lodash/get';

interface IInteractionTemplate {
	interactionTemplates: Array<ITemplate>;
}
interface IGetNewOppData {
	introMessageInteraction: Array<IInteractionTemplate>;
	oppDetailsAndUsers: Array<IOppDetailsAndUsers>;
	oppSummary: boolean; // oppSummary just return if succeed or not
}

function* getAssociatedOppsSaga() {
	const userData: IUserData = yield select(getUserDataSelector);

	try {
		const opportunityList = yield call(
			OppConnectorsEP.getAssociatedOpps,
			userData.id!
		);

		// Filtering duplicates in the opportunityList

		const filterecOpportunityList = Object.values(
			//@ts-ignore
			opportunityList.reduce((acc, item) => {
				if (!acc[item.opportunity.id]) {
					acc[item.opportunity.id] = item;
				}
				return acc;
			}, {})
		);

		const EntityEnumText = ['Connector', 'Owner', 'Target'];
		const entityStatusDataPointer = {
			[EntityEnum.OWNER]: 'opportunity.opportunityStatus',
			[EntityEnum.CONNECTOR]: 'opportunityConnectorStatus',
			[EntityEnum.TARGET]: 'opportunityTargets[0].opportunityTargetStatus'
		};
		const assosiatedOpps = filterecOpportunityList.reduce(
			//@ts-ignore
			(acc: IAssociatedOppsSection, opp: IAssociatedOpp) => {
				let role =
					userData.id === opp.ownerUserId
						? EntityEnum.OWNER
						: userData.id === opp.connectorUserId
						? EntityEnum.CONNECTOR
						: EntityEnum.TARGET;

				const statusData = _get(opp, entityStatusDataPointer[role]);
				if (statusData) {
					const opportunityData: ISingleOppInList = {
						title: opp.opportunity.title,
						status: statusData.id,
						statusTitle: statusData.title,
						statusColor: statusData.color,
						id: opp.opportunityId
					};

					if (role === EntityEnum.CONNECTOR) {
						opportunityData.entityId = opp.id; // This is the opp connector Id, not UserId or opportunityId
					}

					if (role === EntityEnum.TARGET) {
						opportunityData.entityId = opp.opportunityTargets[0].id; // This is the opp target Id, not UserId
					}

					acc[role] = acc[role]
						? {
								...acc[role],
								data: [...acc[role].data, opportunityData]
						  }
						: {
								sectionTitle: EntityEnumText[role],
								data: [opportunityData]
						  };
				}

				return acc;
			},
			[]
		);

		yield put(setAssociatedOpps(assosiatedOpps));
	} catch (error) {
		console.log('error fetching associatedOpps', error);
	}
}

function* getOppDetailsTargetsAndConnectorsSaga({
	payload
}: IPayload<IGetTargetsPayload>) {
	const { role, oppId } = payload;

	try {
		const oppDetailsResponse = yield call(
			OppConnectorsEP.getOppDetailsAndUsers,
			{
				oppId
			}
		);
		// Running 2 requests in parallel, 1. targets and connectors 2. oppSummary (oppSummary is separated because we will need to use in target profile aswell)
		const { oppConnectorsResponse } = yield all({
			oppConnectorsResponse: call(
				OppConnectorsEP.getOppDetailsTargetsAndConnectors,
				payload
			),

			oppSummary: call(getOppSummarySaga, {
				payload: {
					oppId,
					oppTypeId: oppDetailsResponse[0].opportunity.opportunityTypeId
				}
			})
		});
		const {
			id,
			opportunityStatusId,
			timestamp,
			title,
			opportunityTypeId
		} = oppDetailsResponse[0].opportunity;
		const { user } = oppDetailsResponse[0]; // This is the owner user object
		const oppDetails: IOppFullDetails = {
			oppId: id,
			opportunityTypeId,
			oppStatus: opportunityStatusId,
			oppTitle: title,
			creationTime: timestamp,
			ownerUserName: `${user.firstName} ${user.lastName}`,
			ownerUserId: user.id
		};
		yield put(setOppDetails(oppDetails));
		let oppTargets: Array<IOppTargetDetails> = [];
		let oppConnectors: Array<IOppConnectorDetails> = [];

		// Creating oppTargets List and oppConnectors list (for owners only)

		oppConnectorsResponse.forEach(
			(oppConnector: IOppConnectorsExpandedWithTargets, index: number) => {
				const [connectorAvatar, connectorAvatarType] = extractAvatarFromUser(
					oppConnector.user1
				);
				const oppConnectorDetails = {
					oppConnectorId: oppConnector.id,
					oppConnectorUserId: oppConnector.user1.id,
					oppConnectorAvatar: connectorAvatar!,
					oppConnectorAvatarType: connectorAvatarType!,
					oppConnectorUsername: `${oppConnector.user1.firstName} ${oppConnector.user1.lastName}`
				};
				if (role === EntityEnum.OWNER && oppConnector.opportunityStatusId) {
					//@ts-ignore
					oppConnectors.push({
						...oppConnectorDetails,
						oppConnectorStatus: oppConnector.opportunityStatusId,
						connectorTargetsCount: 0
					});
				}

				oppConnector.opportunityTargets.forEach(oppTarget => {
					const { id, user, opportunityTargetStatusId } = oppTarget;
					const oppTargetPhone = user.userPhones![0]
						? user.userPhones![0].phone
						: '';
					const [targetAvatar, targetAvatarType] = extractAvatarFromUser(
						oppTarget.user
					);
					oppTargets.push({
						targetUserId: user.id,
						oppTargetId: id,
						oppTargetUsername: `${user.firstName} ${user.lastName}`,
						statusId: opportunityTargetStatusId,
						oppTargetAvatar: targetAvatar!,
						oppTargetAvatarType: targetAvatarType!,
						oppTargetEmail: user.email ? user.email : '',
						oppTargetPhone,
						...oppConnectorDetails
					});
					if (
						// Only count the targets that are not pending or deleted (counting the specific connector targets number)
						opportunityTargetStatusId !==
							TargetStatusesEnum.DELETE_AND_FORGOT &&
						opportunityTargetStatusId !== TargetStatusesEnum.PENDING &&
						role === EntityEnum.OWNER
					) {
						oppConnectors[index].connectorTargetsCount++;
					}
				});
			}
		);
		yield put(getOppDetailsTargetsAndConnectorsSuccess());

		yield put(setTargetsAndConnectors({ oppTargets, oppConnectors }));
	} catch (ex) {
		yield put(getOppDetailsTargetsAndConnectorsError());

		console.log('Cannot get Targets data', JSON.stringify(ex, null, 2));
	}
}
interface IGetOppSummaryPayload {
	oppId: string;
	oppTypeId: string;
}

function* getOppSummarySaga({ payload }: IPayload<IGetOppSummaryPayload>) {
	const { oppId, oppTypeId } = payload;
	try {
		const TemplateFields = yield call(
			OppTemplateFieldsEP.getOppTemplateFields,
			oppId
		);
		const oppSummary = templateFieldsToOppSummary(TemplateFields, oppTypeId);
		yield put(setOppSummary(oppSummary));
		return true; // return success for whos calling it
	} catch (error) {}
}

function* changeTargetStatusSaga({
	payload
}: IPayload<IChangeTargetStatusPayload>) {
	const role = yield select(roleSelector);
	const { targetId, newStatus, cb } = payload;
	try {
		yield call(OppTargetsEP.changeTargetStatus, payload);

		// Update target status inside the Target screen
		if (role === EntityEnum.TARGET) {
			yield put(updateTargetStatusInsideProfile(newStatus));
		} else {
			// Updates the target inside the oppoverview scene
			yield put(
				updateTargetStatusId({
					targetId,
					newStatus
				})
			);
		}
		if (typeof cb === 'function') {
			cb();
		}
	} catch (ex) {
		console.log('Error changing oppTarget Status', ex);
	}
}

function* changeEntityDecisionSaga({
	payload
}: IPayload<IChangeEntityDecisionPayload>) {
	const { newOppAndTargetProfile } = yield select(oppOverviewSelector);
	const entityId =
		payload.role === EntityEnum.CONNECTOR
			? newOppAndTargetProfile.id
			: newOppAndTargetProfile.opportunityTargets[0].id;

	const patchData = {
		...payload,
		entityId
	};
	try {
		// the endpoint service makes the route decision based on the role
		yield call(OppConnectorsEP.changeEntityDecision, patchData);
		payload.callback();
	} catch (ex) {
		console.log('Error changeEntityDecisionSaga');
	}
}

function* changeOppStatusSaga({
	payload: newStatus
}: IPayload<OpportunityStatusesEnum>) {
	try {
		const { oppDetails }: IOppOverViewSelector = yield select(
			oppOverviewSelector
		);
		yield call(opportunitiesEP.changeOppStatus, newStatus, oppDetails);
		yield put(updateOppStatus(newStatus));
	} catch (ex) {
		console.log('Error changing opp status', ex);
	}
}

function* getPredefinedMessagesSaga() {
	try {
		const predefinedMessages = yield call(TemplatesEP.getPredefinedQuestions);
		const fixedPredefinedMessages = predefinedMessages.map((message: any) => {
			const { creatorUserId, timestamp, ...rest } = message;
			return rest;
		});
		yield put(setPredefinedQuestions(fixedPredefinedMessages));
	} catch (ex) {
		console.log('Error fetching predefined questions', ex);
	}
}

function* getNewOppAndTargetProfileSaga() {
	const { selectedOppId, role }: IOppOverViewSelector = yield select(
		oppOverviewSelector
	);
	const { userData } = yield select(getAuthStateSelector);
	const TemplateType = // Decides wich type of Ineraction to bring based on the Role.
		role === EntityEnum.CONNECTOR
			? InteractionTypesEnum.SEND_INVITE
			: InteractionTypesEnum.INTRODUCTION;

	try {
		const oppDetailsAndUsers = yield call(
			OppConnectorsEP.getOppDetailsForNewOppAndTargetProfile,
			{
				oppId: selectedOppId,
				userId: userData.id
			}
		);
		// Yields 2 requests in parallel
		const { introMessageInteraction, oppSummary }: IGetNewOppData = yield all({
			introMessageInteraction: call(InteractionsEP.getIntroMessage, {
				oppId: selectedOppId,
				TemplateType
			}),
			oppSummary: call(getOppSummarySaga, {
				payload: {
					oppId: selectedOppId,
					oppTypeId: oppDetailsAndUsers[0].opportunity.opportunityTypeId
				}
			})
		});

		// Check that all data is valid before continuing
		const isInteractionMessageValid =
			introMessageInteraction.length &&
			!!introMessageInteraction[0].interactionTemplates.length;
		const isoppDetailsAndUsersValid = !!oppDetailsAndUsers.length;

		const allDataIsValid =
			isInteractionMessageValid && oppSummary && isoppDetailsAndUsersValid;

		if (allDataIsValid) {
			const interactionMessage =
				introMessageInteraction[0].interactionTemplates[0];
			const oppAndUsersData = oppDetailsAndUsers[0];

			const messageWithoutHTML = interactionMessage.body
				? removeHTMLTags(interactionMessage.body)
				: '';
			interactionMessage.body = messageWithoutHTML;

			yield put(setNewOppData({ interactionMessage, oppAndUsersData }));
		} else if (isoppDetailsAndUsersValid && !isInteractionMessageValid) {
			const interactionMessage = { title: '', body: '' };
			const oppAndUsersData = oppDetailsAndUsers[0];
			yield put(
				setNewOppData({
					interactionMessage: interactionMessage as any,
					oppAndUsersData
				})
			);
		}
	} catch (ex) {
		console.log('error getNewOppAndTargetProfileSaga', ex);
	}
}

function* sendInteractionSaga({ payload }: IPayload<ISendInteractionPayload>) {
	const userData = yield select(getUserDataSelector);
	const {
		role,
		oppDetails,
		ccToConnector
	}: IOppOverViewSelector = yield select(oppOverviewSelector);
	const {
		body,
		targetUserId,
		isPredefinedMessage,
		predefinedMessageTemplateId,
		connectorUserId,
		ownerUserId,
		targetId,
		connectorId,
		cb
	} = payload;
	const {} = oppDetails;

	const fromUserId = userData.id;
	const templateId = isPredefinedMessage
		? predefinedMessageTemplateId
		: InteractionTemplateFieldsEnum.INTERNTAL_MESSAGE;

	const interactionTypeId = isPredefinedMessage
		? InteractionTypesEnum.PREDEFINED_MESSAGE
		: InteractionTypesEnum.ASK_QUESTION_MESSAGE;

	const interactionSubscribers = [];

	if (role === EntityEnum.OWNER || role === EntityEnum.CONNECTOR) {
		interactionSubscribers.push({
			userId: targetUserId,
			IntSubResponseTypeId: IntSubResponseTypesEnum.YES_NO
		});
	}

	if (role === EntityEnum.TARGET) {
		interactionSubscribers.push({
			userId: ownerUserId,
			IntSubResponseTypeId: IntSubResponseTypesEnum.YES_NO
		});
	}
	// if Target or owner choose to cc the connector
	if (
		ccToConnector &&
		(role === EntityEnum.OWNER || role === EntityEnum.TARGET)
	) {
		interactionSubscribers.push({
			userId: connectorUserId,
			IntSubResponseTypeId: IntSubResponseTypesEnum.YES_NO
		});
	}
	// TODO Yaron - adding dynamic OppConnector and oppTarget Id's
	const data = {
		// opportunityConnectorId: connectorId,
		opportunityTargetId: targetId,
		timestamp: new Date(),
		fromUserId,
		interactionTypeId,
		interactionStatusId: InteractionStatuses.SEND_MESSAGE,
		interactionTemplates: [
			{
				body,
				templateId
			}
		],
		interactionSubscribers
	};
	try {
		yield InteractionsEP.create(data);
		if (typeof cb === 'function') {
			cb();
		}
	} catch (ex) {
		console.log('Error sending interaction');
	}
}

function* sendSpacielInteractionSaga({
	payload
}: IPayload<ISpecialInteractionPayload>) {
	const userData: IUserData = yield select(getUserDataSelector);
	const currentEntityName = `${userData.firstName} ${userData.lastName}`;
	const { targetUsername, type, calendarData, targetId } = payload;
	const transformedBody = createInteractionBody({
		type,
		fromUsername: currentEntityName,
		toUsername: targetUsername,
		calendarData: calendarData!
	});

	const data = {
		opportunityConnectorId: null,
		opportunityTargetId: targetId || null,
		timestamp: new Date(),
		fromUserId: userData.id,
		interactionTypeId: type,
		interactionStatusId: InteractionStatuses.SEND_MESSAGE,
		interactionTemplates: [
			{
				body: transformedBody
			}
		]
	};

	try {
		yield InteractionsEP.create(data);
	} catch (ex) {
		console.log('Error sending spaciel interaction');
	}
}

export function* watchOppOverviewSaga() {
	yield all([
		takeLatest(
			OppOverviewTypes.GET_ASSOCIATED_OPPS as any,
			getAssociatedOppsSaga
		),
		takeLatest(OppOverviewTypes.GET_OPP_SUMMARY as any, getOppSummarySaga),
		takeLatest(
			OppOverviewTypes.GET_OPP_DETAILS_TARGETS_AND_CONNECTORS as any,
			getOppDetailsTargetsAndConnectorsSaga
		),
		takeLatest(
			OppOverviewTypes.CHANGE_TARGET_STATUS as any,
			changeTargetStatusSaga
		),
		takeLatest(
			OppOverviewTypes.CHANGE_ENTITY_DECISION as any,
			changeEntityDecisionSaga
		),
		takeLatest(OppOverviewTypes.CHANGE_OPP_STATUS as any, changeOppStatusSaga),
		takeLatest(
			OppOverviewTypes.GET_PREDEFINED_MESSAGES as any,
			getPredefinedMessagesSaga
		),
		takeLatest(OppOverviewTypes.SEND_INTERACTION as any, sendInteractionSaga),
		takeLatest(
			OppOverviewTypes.GET_NEW_OPP_DATA as any,
			getNewOppAndTargetProfileSaga
		),
		takeLatest(
			OppOverviewTypes.SEND_SPACIEL_INTERACTION as any,
			sendSpacielInteractionSaga
		)
	]);
}
