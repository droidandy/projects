import { capitalize } from '../../utils';

export const createSagaRequestSelectors = (reducerName: string, getter?: (state: any) => any) => {
	const getReducer = (state: any) => getter ? getter(state) : state[reducerName];

	const globalSelector = (state: any) => getReducer(state);
	const dataSelector = (state: any) => getReducer(state).data;
	const loadingSelector = (state: any) => !!getReducer(state).pending;
	const errorSelector = (state: any) => getReducer(state).error;
	const countSelector = (state: any) => getReducer(state).count;

	const entityName = capitalize(reducerName);

	return {
		[`select${entityName}`]: globalSelector,
		[`select${entityName}Data`]: dataSelector,
		[`select${entityName}Loading`]: loadingSelector,
		[`select${entityName}Error`]: errorSelector,
		[`select${entityName}Count`]: countSelector
	};
}
