import { MyOppsTypes } from '../constants';
import { IOppItem } from '../../types/interfaces';

export const getMyOpps = (authId: string) => {
	return {
		type: MyOppsTypes.GET_MY_OPPS,
		payload: { authId }
	};
};

export const setMyOpps = (opps?: Array<IOppItem>) => ({
	type: MyOppsTypes.SET_MY_OPPS,
	payload: opps
});

export const resetMyOppsState = () => ({
	type: MyOppsTypes.RESET_MY_OPPS_STATE
});
