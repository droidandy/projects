import { PendingTypes } from '../actions/pendingActions';

const initialState = {
	linkers: {},
	loadings: {}
};

const pendingReducer = (state = initialState, { type, payload, meta }) => {
	switch (type) {
		case PendingTypes.ADD_PENDING: {
			return {
				...state,
				loadings: {
					...state.loadings,
					[payload]: true
				}
			}
		}
		case PendingTypes.REMOVE_PENDING: {
			return {
				...state,
				loadings: {
					...state.loadings,
					[payload]: false
				}
			}
		}
		case PendingTypes.REMOVE_PENDINGS: {
			const updatedLoadings = payload.reduce((total, origin) => {
				total[origin] = false;
				return total;
			}, {})

			return {
				...state,
				loadings: {
					...state.loadings,
					...updatedLoadings
				}
			}
		}
		case PendingTypes.ADD_LINKER: {
			const { origin, finishOn } = payload;
			return {
				...state,
				linkers: {
					...state.linkers,
					[origin]: finishOn
				}
			}
		}
		default: {
			return state;
		}
	}
};

export default pendingReducer;