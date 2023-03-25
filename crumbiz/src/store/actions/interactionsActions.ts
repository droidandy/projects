import { InteractionsTypes } from '../constants';
import {
	createInteractionsAction,
	createPaginatedRequestAction,
	createRequestAction,
	createUpdateActionType,
	createClearAction
} from './utils';

export const getSummaryData = createRequestAction(
	InteractionsTypes.GET_SUMMARY_DATA,
	() => ({
		request: {
			url: '/Utils/CalcGeneralSumData'
		}
	})
);

export const getInteractionsData = createPaginatedRequestAction(
	createInteractionsAction(InteractionsTypes.GET_INTERACTIONS)
);

export const clearInteractionState = createClearAction(
	InteractionsTypes.GET_INTERACTIONS
);
