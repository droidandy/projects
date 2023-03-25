import { useSelector, shallowEqual } from 'react-redux';

export function useShallowEqualSelector(selector: any) {
	return useSelector(selector, shallowEqual);
}
