import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreator, bindActionCreators } from 'redux';

export function useActions(actions: object) {
	const dispatch = useDispatch();
	return useMemo(() => {
		return bindActionCreators(actions, dispatch);
	}, [dispatch]);
}