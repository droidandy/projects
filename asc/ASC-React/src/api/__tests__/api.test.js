import * as api from '../api';
import { setAuthToken } from '../../utils/localStorageStore';

test('getHost', () => {
  expect(api.getHost('web')).toBe('kubernetes.baseurl');
  expect(api.getHost('app')).toBe('api.actionsportscommunity.com');
  expect(api.getHost('local')).toBe('localhost');
  expect(api.getHost()).toBe('localhost');
});

test('getToken', () => {
  setAuthToken('secret');
  expect(api.getToken(true)).toBe('secret');
  expect(api.getToken(false)).toBeFalsy();
  localStorage.clear();
});

test('getHeaders', () => {
  const token = 'foo';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  expect(api.getHeaders(false)).toEqual(headers);
  expect(api.getHeaders(token))
    .toEqual({ ...headers, Authorization: `Bearer ${token}` });
});

test('getURL', () => {
  const endpoint = '/baz';

  expect(api.getURL('AUTH', endpoint))
    .toBe('http://localhost:3100/v1/identities/baz');
  expect(api.getURL('USER', endpoint))
    .toBe('http://localhost:3000/v1/profiles/baz');
  expect(api.getURL('COMMS', endpoint))
    .toBe('http://localhost:3900/v1/email/baz');
});

test('getBody', () => {
  const params = { foo: 'baz' };

  expect(api.getBody(params, 'GET')).toEqual({});
  expect(api.getBody(params, 'POST')).toBe('{\"foo\":\"baz\"}');
});

describe('checkError', () => {
  it('success flow', () => {
    const json = { foo: 'baz' };
    expect(api.checkError(json)).toEqual(json);
  });

  it('failure flow with a message', () => {
    const json = { status: 404, message: 'foo' };

    try {
      api.checkError(json);
    } catch (error) {
      expect(error.message).toBe(json.message);
    }
  });

  it('failure flow with an array of errors', () => {
    const json = { status: 404, message: { message: 'foo', errors: ['foo'] } };

    try {
      api.checkError(json);
    } catch (error) {
      expect(error.message).toBe(json.message.message);
      expect(error.errors).toEqual(json.message.errors);
    }
  });
});

describe('callApi', () => {
  it('success flow', async () => {
    const json = { foo: 'baz' };
    const params = {
      method: 'POST',
      api: 'AUTH',
      endpoint: '/',
      body: { foo: 'baz' },
      token: true
    };

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => (json)
    }));

    const response = await api.callApi(params);

    expect(fetch.mock.calls[0][0])
      .toEqual(api.getURL(params.api, params.endpoint));
    expect(fetch.mock.calls[0][1].method).toEqual(params.method);
    expect(fetch.mock.calls[0][1].headers)
      .toEqual(api.getHeaders(api.getToken(params.token)));
    expect(fetch.mock.calls[0][1].body)
      .toEqual(api.getBody(params.body, params.method));

    expect(response).toEqual(json);
  });

  it('failure flow', async () => {
    const error = { message: 'baz' };
    const params = {
      method: 'POST',
      api: 'AUTH',
      endpoint: '/',
      body: { foo: 'baz' },
      token: true
    };

    global.fetch = jest.fn().mockImplementation(() => Promise.reject(error));

    try {
      await api.callApi(params);

      expect(fetch.mock.calls[0][0])
        .toEqual(api.getURL(params.api, params.endpoint));
      expect(fetch.mock.calls[0][1].method).toEqual(params.method);
      expect(fetch.mock.calls[0][1].headers)
      .toEqual(api.getHeaders(api.getToken(params.token)));
      expect(fetch.mock.calls[0][1].body)
        .toEqual(api.getBody(params.body, params.method));
    } catch (error) {
      expect(error.message).toBe(error.message);
    }
  });

  it('failure flow - response with a status 404', async () => {
    const json = { status: 404, message: 'foo' };
    const params = {
      method: 'POST',
      api: 'AUTH',
      endpoint: '/',
      body: { foo: 'baz' },
      token: true
    };

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => (json)
    }));

    try {
      await api.callApi(params);

      expect(fetch.mock.calls[0][0])
        .toEqual(api.getURL(params.api, params.endpoint));
      expect(fetch.mock.calls[0][1].method).toEqual(params.method);
      expect(fetch.mock.calls[0][1].headers)
      .toEqual(api.getHeaders(api.getToken(params.token)));
      expect(fetch.mock.calls[0][1].body)
        .toEqual(api.getBody(params.body, params.method));
    } catch (error) {
      expect(error.message).toBe(error.message);
    }
  });
});
