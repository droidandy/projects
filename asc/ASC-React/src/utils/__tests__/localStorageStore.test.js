import * as s from '../localStorageStore';

beforeEach(() => {
  s.setAuthToken('secret');
});

afterEach(() => {
  localStorage.clear();
});

test('getAuthToken', () => {
  s.getAuthToken();
  expect(localStorage.data).toEqual({ token: 'secret' });
});

test('setAuthToken', () => {
  expect(localStorage.data).toEqual({ token: 'secret' });
});

test('removeAuthToken', () => {
  s.removeAuthToken('secret');
  expect(localStorage.data).toEqual({});
});
