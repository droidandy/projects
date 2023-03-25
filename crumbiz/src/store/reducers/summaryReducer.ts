import { requestsReducer } from 'redux-saga-requests';
import { InteractionsTypes } from '../constants';

export default requestsReducer({
	actionType: InteractionsTypes.GET_SUMMARY_DATA,
	getDefaultData: () => ({}),
	getData: (state, { data }) => ({
		openOpps: data.OpenOpps,
		intros: data.Intros,
		pendingIntros: data.Pending
	})
});