import * as Axios from 'axios';
import { configuration } from '../configuration';

Axios.default.defaults.withCredentials = true;

const headers = () => {
    const raw = localStorage.authToken;

    if (!raw) {
        return {};
    }

    const parsed = JSON.parse(raw);
    const token = parsed.accessToken;

    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getError = (error: Axios.AxiosError) => {
    if (error.message.toLowerCase() === 'network error' || error.code === 'ECONNABORTED') {
        return new Error('Error connecting to server.');
    }
    const e: any = error.response || undefined;
    return new Error(e);
};

export const Request = {
    get: async (url: string) => {
        return Axios.default
            .get(`${configuration.api.root}${url}`, { headers: headers() })
            .then(response => response.data)
            .catch((error) => { throw getError(error); });
    },
    post: async (url: string, body?: any) => {
        return Axios.default
            .post(`${configuration.api.root}${url}`, body, { headers: headers() })
            .then(response => response.data)
            .catch((error) => { throw getError(error); });
    },
    patch: async (url: string, body?: any) => {
        return Axios.default
            .patch(`${configuration.api.root}${url}`, body, { headers: headers() })
            .then(response => response.data)
            .catch((error) => { throw getError(error); });
    },
};
