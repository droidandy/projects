import { requestsReducer } from 'redux-saga-requests';
import { IVInteraction } from '../../types/interfaces';
import {
	createUpdateActionType,
	createClearActionType
} from '../actions/utils';

export const createInteractionsReducer = (actionType: string) => {
	const updateActionType = createUpdateActionType(actionType);
	const clearActionType = createClearActionType(actionType);

	return requestsReducer({
		actionType,
		getDefaultData: () => [],
		getData: (state, action) => action.data.value,
		mutations: {
			[updateActionType]: {
				updateData: (state, { payload }) =>
					state.data.map((interaction: IVInteraction) => {
						return payload[interaction.id] || interaction;
					}),
				local: true
			}
		},
		onSuccess: (state, { data }) => ({
			...state,
			data: [...state.data, ...data.value],
			count: data['@odata.count'],
			pending: 0
		}),
		resetOn: [clearActionType]
	});
};
