import { Action, createAction } from '@reduxjs/toolkit';
import { error, success } from 'redux-saga-requests';
import merge from 'lodash.merge';

export const createRequestAction = (type: string, prepare: Function) => (
	payload = {}
) => {
	const defaultAction = {
		meta: {
			asPromise: true
		}
	};
	const action = merge(defaultAction, {
		...createAction(type)(),
		...prepare(payload)
	});

	return action;
};

export const createSuccessAction = (type: string) =>
	createAction(success(type));
export const createErrorAction = (type: string) => createAction(error(type));

export const prefixFactoryCreator = (actionName: string) => (
	actionType: string
) => {
	const prefix = actionType.split('/')[0];
	return `${prefix}/${actionName}_${actionType
		.split('_')
		.slice(1)
		.join('_')}`;
};

export const createUpdateActionType = prefixFactoryCreator('UPDATE');
export const createClearActionType = prefixFactoryCreator('CLEAR');

const createActionWrapper = (wrapper: (actionType: string) => string) =>
	(actionType: string) => {
		const wrappedActionType = wrapper(actionType);
		return createAction(wrappedActionType);
	};

export const createUpdateAction = createActionWrapper(createUpdateActionType);
export const createClearAction = createActionWrapper(createClearActionType);

const defaultParams = {
	$top: 20,
	$orderBy: 'timestamp desc'
};

interface PaginationActionOptions {
	skip: number;
	top: number;
}

interface PaginatorParams {
	action: Action;
	skip: number;
	top: number;
}

type Paginator = (options: PaginatorParams) => Action;

const ODataPaginator: Paginator = (options: PaginatorParams) => {
	const { action, skip, top } = options;

	const pagination = {
		request: {
			params: {
				$skip: skip,
				$top: top,
				$count: true
			}
		}
	};
	return merge(action, pagination);
};

const createActionsPaginatorFactory = (transformer: Paginator) => (
	actionCreator: any
) => {
	return ({ skip, top, ...rest }: PaginationActionOptions) => {
		const action = actionCreator(rest);
		return transformer({ skip, top, action });
	};
};

export const createPaginatedRequestAction = createActionsPaginatorFactory(
	ODataPaginator
);

export const createInteractionsAction = (
	actionType: string,
	prepare: Function = () => ({})
) => {
	return createRequestAction(actionType, (params: any = {}) => ({
		request: {
			url: '/VInteractions',
			params: {
				...defaultParams,
				...prepare(params)
			}
		},
		meta: {
			loading: true,
			finishOn: [createUpdateActionType(actionType)]
		}
	}));
};
