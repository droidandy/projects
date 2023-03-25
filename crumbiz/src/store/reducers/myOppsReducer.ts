import { IReduxAction, IOppItem } from '../../types/interfaces';
import { MyOppsTypes } from '../constants';

export interface IMyOppsState {
	opps: Array<IOppItem>;
	isLoading: boolean;
}
const initialState: IMyOppsState = {
	opps: [],
	isLoading: false
};

const myOppsReducer = (
	state = initialState,
	action: IReduxAction<MyOppsTypes>
) => {
	switch (action.type) {
		case MyOppsTypes.GET_MY_OPPS: {
			return { ...state, isLoading: true };
		}
		case MyOppsTypes.SET_MY_OPPS: {
			return { ...state, isLoading: false, opps: action.payload };
		}
		case MyOppsTypes.RESET_MY_OPPS_STATE:
			return {
				...initialState
			};
		default:
			return state;
	}
};
export default myOppsReducer;
