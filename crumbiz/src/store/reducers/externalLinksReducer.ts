import { EntityEnum } from '../../types/enums';
import { ExternalLinksTypes } from '../constants';
import { DynamicObject, IReduxAction } from '../../types/interfaces';

export interface IExternalLinksTypes {
	isRediretedWithDeeplink: boolean;
}

const initialState: IExternalLinksTypes = {
	isRediretedWithDeeplink: false
};

const externalLinksReducer = (
	state = initialState,
	action: IReduxAction<ExternalLinksTypes>
) => {
	switch (action.type) {
		case ExternalLinksTypes.SET_REDIRECTED_FROM_EXTERNAL:
			return {
				...state,
				isRediretedWithDeeplink: true
			};

		default:
			return state;
	}
};

export default externalLinksReducer;
