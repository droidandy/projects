import { all, call, put, takeLatest } from 'redux-saga/effects';
import { success } from 'redux-saga-requests';
import { InteractionsTypes, OppOverviewTypes } from '../constants';
import { InteractionTypesEnum } from '../../types/enums';
import { IVInteraction, ODataResponse } from '../../types/interfaces';
import { createUpdateAction } from '../actions/utils';
import crumbizApi from '../../services/api/crumbizInstance';

const IDProperties = {
	[InteractionTypesEnum.FIRST_MESSAGE]: ['toUserId'],
	[InteractionTypesEnum.SEND_MESSAGE]: ['toUserId'],
	[InteractionTypesEnum.INTRODUCTION]: ['fromUserId'],
	[InteractionTypesEnum.GOOD_TO_GO]: ['ownerUserId', 'targetUserId'],
	[InteractionTypesEnum.DONE_DEAL]: ['fromUserId', 'toUserId'],
	[InteractionTypesEnum.REJECTED_INVITE]: ['fromUserId'],
	[InteractionTypesEnum.CONFIRMED_INVITE]: ['fromUserId', 'toUserId'],
	[InteractionTypesEnum.SEND_INVITE]: ['toUserId']
};

enum RolesProperties {
	connectorUserId = 'connectorUserId',
	targetUserId = 'targetUserId',
	ownerUserId = 'ownerUserId'
}
type IFetchDataArray = Array<UserFetchData>;

interface ITransformedIds {
	[key: string]: UserFetchData;
}

const findDefaultData = (id: string, interaction: IVInteraction) => {
	const roleProperty = Object.keys(RolesProperties).find(key => {
		return interaction[key] === id;
	});

	if (!roleProperty) return {};

	const usernameProperty = roleProperty.replace('Id', '');
	const username = interaction[usernameProperty];

	if (!username) return {};

	const [firstName, lastName] = username.split(' ');

	return { firstName, lastName };
};

interface UserFetchData {
	id: string;
	defaultData: any;
}

let alreadyFetchedUsers: IFetchDataArray = [];

function* fetchUsersData(idsData: IFetchDataArray) {
	return yield all(
		idsData.map(({ id, defaultData }) => {
			if (id) {
				const userExistObject = alreadyFetchedUsers.find(
					fetchedUser => id === fetchedUser.id
				);
				if (userExistObject) {
					return userExistObject;
				}

				return crumbizApi
					.get(`/Utils/GetPortfolio?key=${id}`)
					.then(({ data }) => {
						data.id = id;
						alreadyFetchedUsers.push(data);
						return data;
					})
					.catch(() => defaultData);
			}

			return Promise.resolve(defaultData);
		})
	);
}

function* fetchUsersListData(userIds: Array<IFetchDataArray>) {
	const idsToFetch = userIds.reduce((total, idBulk) => {
		idBulk.forEach(fetchData => {
			if (!total[fetchData.id]) {
				total[fetchData.id] = fetchData;
			}
		});
		return total;
	}, {} as ITransformedIds);

	const transformedIdsToFetch = Object.values(idsToFetch);

	const userRes: IFetchDataArray = yield call(
		fetchUsersData,
		transformedIdsToFetch
	);

	const usersInfo = userIds.map(ids => {
		return ids.map(item => {
			const userFetchedData = userRes.find(
				fetchedData => item.id === fetchedData.id
			);
			return userFetchedData;
		});
	});
	return usersInfo;
}

function* getAvatars({
	type,
	data
}: {
	type: string;
	data: ODataResponse<IVInteraction>;
}) {
	const interactions = data.value.filter(({ interactionTypeId }) => {
		return !!IDProperties[interactionTypeId];
	});

	const userIds = interactions.map(interaction => {
		const idProperties = IDProperties[interaction.interactionTypeId];
		return idProperties.map(idProperty => {
			const id = interaction[idProperty];
			const defaultData = findDefaultData(id, interaction);
			return { id, defaultData };
		});
	});

	const usersData = yield call(fetchUsersListData, userIds);

	const updatedPayload = interactions.reduce(
		(total, interaction, dataIndex) => {
			const idProperties = IDProperties[interaction.interactionTypeId];
			total[interaction.id] = {
				...interaction
			};

			idProperties.forEach((idProperty, propertyIndex) => {
				total[interaction.id][idProperty] = usersData[dataIndex][propertyIndex];
			});

			return total;
		},
		{}
	);

	const updateAction = createUpdateAction(type.replace('_SUCCESS', ''));
	yield put(updateAction(updatedPayload));
}

export function* watchInteractionsSaga() {
	yield all([
		takeLatest(success(InteractionsTypes.GET_INTERACTIONS), getAvatars),
		takeLatest(success(OppOverviewTypes.GET_OPP_INTERACTIONS), getAvatars),
		takeLatest(success(OppOverviewTypes.GET_TARGET_INTERACTIONS), getAvatars),
		takeLatest(
			success(OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS),
			getAvatars
		)
	]);
}
