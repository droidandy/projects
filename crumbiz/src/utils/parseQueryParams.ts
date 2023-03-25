import { DynamicObject } from '../types/interfaces';

const parseQueryParams = (url: string) => {
	const regex = /[?&]([^=#]+)=([^&#]*)/g;
	let match;
	const params: DynamicObject<any> = {};

	while ((match = regex.exec(url))) {
		params[match[1]] = match[2];
	}

	return params;
};

export default parseQueryParams;
