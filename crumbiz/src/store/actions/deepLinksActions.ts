import { DeepLinksTypes } from '../constants';

export const setDeepLink = (link: string) => {
	return {
		type: DeepLinksTypes.SET_DEEP_LINK,
		payload: link
	};
};

export const clearDeepLink = () => ({
	type: DeepLinksTypes.CLEAR_DEEP_LINK
});
