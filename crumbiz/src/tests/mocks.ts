import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios'
import { DynamicObject } from '../types/interfaces';
import { capitalize } from '../utils';

interface MockParams {
	url: string,
	method: string,
	status?: number,
	response?: DynamicObject<Object>
};

class MocksManager {
	mock: MockAdapter;
	constructor(axiosInstance: AxiosInstance) {
		this.mock = new MockAdapter(axiosInstance);
	}

	mockRequest = ({ url, status, method, response = {} }: MockParams) => {
		const methodName = capitalize(method.toLowerCase());
		this.mock[`on${methodName}`](url)
			.replyOnce(status || 200, response);
	}

	validate = () => {
		const uncalledHandlers = Object.values(this.mock.handlers)
			.filter(handler => handler.called === 0);

		if (uncalledHandlers.length) {
			const handlersInfo = uncalledHandlers.map(handler => {
				const handlerInfo = JSON.stringify(handler.slice(0, 2))
				return `Handler not called: ${handlerInfo}`;
			}).join('\n');

			throw new Error(`Uncalled handlers:\n ${handlersInfo}`);
		}
	}

	reset = () => {
		this.mock.reset()
	}
}

export default (axiosInstance: AxiosInstance) => {
	return new MocksManager(axiosInstance)
}