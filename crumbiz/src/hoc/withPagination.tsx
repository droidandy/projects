import React, { useCallback, useEffect, useState } from 'react';
import { ActionCreator } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { DynamicObject } from '../types/interfaces';
import { createClearAction } from '../store/actions/utils';

interface IPaginationOptions {
	top: number;
	enhancer: Function;
	action: ActionCreator<any>;
	actionType: string;
	dataSelector: (state: any) => any;
	countSelector: (state: any) => any;
}

interface IProps {
	actionProps?: DynamicObject<any>;
	backgroundColor?: string;
	listProps?: DynamicObject<any>;
}

const withPagination = (options: IPaginationOptions) => {
	const {
		enhancer,
		top,
		action,
		dataSelector,
		countSelector,
		actionType
	} = options;
	const enhancedAction = enhancer(action);

	const PaginatedComponent = (WrappedComponent: React.FC<any>) => (
		props: IProps
	) => {
		const { actionProps } = props;
		// const [skip, setSkip] = useState(0);

		const data: Array<any> = useSelector(dataSelector);
		const count: number = useSelector(countSelector);
		const resetInteractionAction = createClearAction(actionType);

		const dispatch = useDispatch();
		const handleEndReached = useCallback(() => {
			if (!count || data.length < count) {
				// const newSkip = skip + top;
				dispatch(enhancedAction({ top, skip: data.length, ...actionProps }));
				// setSkip(newSkip);
			}
		}, [top, count, data]);

		useEffect(() => {
			// This is responsive for the initial fetch and when interaction state is resetted
			if (!count) {
				dispatch(enhancedAction({ top, skip: 0, ...actionProps }));
			}
		}, [count]);

		useEffect(
			// Reset interaction chunck of state when unmounting
			() => () => {
				dispatch(resetInteractionAction());
			},
			[]
		);

		return (
			<WrappedComponent
				onEndReached={handleEndReached}
				data={data}
				{...props}
			/>
		);
	};

	PaginatedComponent.defaultProps = {
		actionProps: {}
	};

	return PaginatedComponent;
};

export default withPagination;
