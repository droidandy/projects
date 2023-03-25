import { DynamicObject } from '../../types/interfaces';
import {
	addLinker,
	addPending,
	removePending,
	removePendings
} from '../actions/pendingActions';
import { Middleware } from 'redux';

const findLinkers = (type: string, linkers: DynamicObject<any>) => {
	return Object.keys(linkers).filter(key => linkers[key].includes(type));
};

const getActionName = (actionType: string) => {
	return actionType
		.split('_')
		.slice(0, -1)
		.join('_');
};

export default (): Middleware => store => next => action => {
	const { type, request, meta = {} } = action;
	const state: DynamicObject<any> = store.getState().pending;

	const relevantLinkers = findLinkers(type, state.linkers);

	if (!!relevantLinkers.length) {
		store.dispatch(removePendings(relevantLinkers));
	}

	if (type.endsWith('_SUCCESS') || type.endsWith('_ERROR')) {
		const actionName = getActionName(type);
		if (state.loadings[actionName]) {
			store.dispatch(removePending(actionName));
		}
	} else if ((meta && meta.loading) || !!request) {
		if (meta.finishOn) {
			store.dispatch(addLinker({ origin: type, finishOn: meta.finishOn }));
		}
		store.dispatch(addPending(type));
	}

	return next(action);
};
