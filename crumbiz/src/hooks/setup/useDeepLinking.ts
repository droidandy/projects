import branch from 'react-native-branch';
import { useAppStateChanged } from '../index';
import { useEffect, useRef } from 'react';
import { DynamicObject, PlainFunction } from '../../types/interfaces';
import { redirectHandler } from '../../navigation/branchDeeplinkHandler';
import { useSelector, useDispatch } from 'react-redux';
import { userAuthenticatedSelector } from '../../store/selectors/authSelector';
import { deepLinksSelector } from '../../store/selectors/deepLinksSelector';
import { clearDeepLink } from '../../store/actions/deepLinksActions';

interface IParams {
	onInitialSubscribe: PlainFunction;
}
let didSubscription = false;
const useDeepLinking = () => {
	let _unsubscribe = useRef<PlainFunction>(null).current;
	const userAuthenticationStatus = useSelector(userAuthenticatedSelector);
	const deepLinksData = useSelector(deepLinksSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		// make the subscription only when init authentication finished
		if (userAuthenticationStatus !== null && !didSubscription) {
			didSubscription = true;
			branch.subscribe(params => {
				const { error, params: data } = params;
				console.log(params);
				if (data['+clicked_branch_link']) {
					redirectHandler(data);
				}
			});
		}
	}, [userAuthenticationStatus]);

	useEffect(() => {
		// If Push caught action that requires authentication it is saved in the store and will be handled here after authentication is true
		if (userAuthenticationStatus && deepLinksData.deepLinkParams) {
			redirectHandler(deepLinksData.deepLinkParams as any);
			dispatch(clearDeepLink());
		}
	}, [userAuthenticationStatus, deepLinksData]);
	// useAppStateChanged({
	// 	onForeground: () => {
	// 		if (!_unsubscribe) {
	// 			_unsubscribe = (branch.subscribe(params => {
	// 				const { error, params: data } = params;
	//
	// 				if (data['+clicked_branch_link']) {
	// 					redirectHandler(data);
	// 				}
	// 			}) as unknown) as PlainFunction;
	// 		}
	// 	},
	//
	// 	onBackground: () => {
	// 		// ALSO TRIED WITHOUT UNSUBSUBSCRIBE;
	// 		// if (_unsubscribe && typeof _unsubscribe === 'function') {
	// 		// 	_unsubscribe();
	// 		// 	_unsubscribe = null;
	// 		// }
	// 	}
	// });
};

export default useDeepLinking;
