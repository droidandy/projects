import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import * as constants from '../authConstants';
import * as actions from '../authActions';
import * as sagas from '../authSagas';
import * as selectors from '../authSelectors';
import { callApi } from '../../../api/api';
import { getAuthToken, setAuthToken } from '../../../utils/localStorageStore';

// ------------------------------------
// TEST Get Token saga
// ------------------------------------
it('getToken', () => {
  const body = { foo: 'baz' };
  const data = 'foo';

  const params = {
    method: 'POST',
    api: 'AUTH',
    endpoint: '/login/basic',
    body
  };

  const generator = sagas.getToken(body);

  expect(generator.next().value)
    .toEqual(call(sagas.retryAuth, callApi, params));

  expect(generator.next(data).value).toEqual(call(setAuthToken, data));
});

// ------------------------------------
// TEST Get User Profile Flow
// ------------------------------------
describe('getProfileFlow', () => {
  const action = { payload: 'test@test.com' };

  const params = {
    api: 'USER',
    endpoint: `?publicEmail=${action.payload}`,
    token: true
  };

  it('success flow', () => {
    const data = ['foo'];

    const generator = sagas.getProfileFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.next(data).value)
      .toEqual(put(actions.getProfile.success(data[0])));
  });

  it('failure flow', () => {
    const error = 'foo';

    const generator = sagas.getProfileFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.throw(error).value)
      .toEqual(put(actions.getProfile.failure(error)));
  });
});

// ------------------------------------
// TEST Update User Profile Flow
// ------------------------------------
describe('updateProfileFlow', () => {
  const action = {
    payload: {
      profileID: '1',
      profile: { foo: 'baz' }
    }
  };

  const { profileID, profile: body } = action.payload;

  const params = {
    method: 'PUT',
    api: 'USER',
    endpoint: `/${profileID}`,
    body,
    token: true
  };

  it('success flow', () => {
    const data = 'foo';

    const generator = sagas.updateProfileFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.next(data).value)
      .toEqual(put(actions.updateProfile.success(data)));
  });

  it('failure flow', () => {
    const error = 'foo';

    const generator = sagas.updateProfileFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.throw(error).value)
      .toEqual(put(actions.updateProfile.failure(error)));
  });
});

// ------------------------------------
// TEST Save User Profile Flow
// ------------------------------------
describe('saveProfileFlow', () => {
  const action = { payload: 'foo' };

  const params = {
    method: 'POST',
    api: 'USER',
    body: action.payload,
    token: true
  };

  it('success flow', () => {
    const data = 'foo';

    const generator = sagas.saveProfileFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.next(data).value)
      .toEqual(put(actions.saveProfile.success(data)));
  });

  it('failure flow', () => {
    const error = 'foo';

    const generator = sagas.saveProfileFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.throw(error).value)
      .toEqual(put(actions.saveProfile.failure(error)));
  });
});

// ------------------------------------
// TEST Login vie Email/Password Flow
// ------------------------------------
describe('loginEmailFlow', () => {
  const action = {
    payload: {
      email: 'test@test.com',
      password: 'secret'
    }
  };

  const { email, password } = action.payload;
  const body = { email, password };

  it('success flow', () => {
    const auth = { userProfile: { identityID: '1' } };
    const userAuthData = { email, identityID: auth.userProfile.identityID };
    const token = 'foo';

    const generator = sagas.loginEmailFlow(action);

    expect(generator.next().value).toEqual(call(sagas.getToken, body));

    expect(generator.next().value).toEqual(call(getAuthToken));

    expect(generator.next(token).value)
      .toEqual(put(actions.getProfile.request(email)));

    expect(generator.next().value)
      .toEqual(take(constants.GET_PROFILE_SUCCESS));

    expect(generator.next().value).toEqual(select(selectors.getAuth));

    expect(generator.next(auth).value)
      .toEqual(put(actions.loginEmail.success({ userAuthData, token })));
  });

  it('failure flow', () => {
    const error = 'baz';

    const generator = sagas.loginEmailFlow(action);

    expect(generator.next().value).toEqual(call(sagas.getToken, body));

    expect(generator.next().value).toEqual(call(getAuthToken));

    expect(generator.next().value)
      .toEqual(put(actions.getProfile.request(email)));

    expect(generator.throw(error).value)
      .toEqual(put(actions.loginEmail.failure(error)));
  });
});

// ------------------------------------
// TEST Register User Flow
// ------------------------------------
describe('registerUserFlow', () => {
  const action = {
    payload: {
      email: 'test@test.com',
      password: 'secret',
      regInfo: 'foo',
      addProfile: { foo: 'baz' }
    }
  };

  const { email, password, regInfo, addProfile } = action.payload;

  const body = { email, password };

  const params = { method: 'POST', api: 'AUTH', body };

  it('success flow', () => {
    const user = { _id: '1' };
    const { _id: identityID } = user;
    const profile = { identityID, culture: regInfo || '', ...addProfile };
    const token = 'foo';
    const userAuthData = { email, identityID };

    const generator = sagas.registerUserFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.next(user).value).toEqual(call(sagas.getToken, body));

    expect(generator.next().value).toEqual(call(getAuthToken));

    expect(generator.next(token).value)
      .toEqual(put(actions.saveProfile.request(profile)));

    expect(generator.next().value)
      .toEqual(put(actions.registerUser.success({ userAuthData, token })));
  });

  it('failure flow', () => {
    const error = {
      message: 'foo',
      errors: ['baz']
    };

    const generator = sagas.registerUserFlow(action);

    expect(generator.next().value)
      .toEqual(call(sagas.retryAuth, callApi, params));

    expect(generator.throw(error).value)
      .toEqual(put(actions.registerUser.failure(error)));
  });
});

// ------------------------------------
// Watch Auth saga
// ------------------------------------
it('watchAuth', () => {
  const generator = sagas.watchAuth();

  expect(generator.next().value)
    .toEqual(takeEvery(
      constants.REGISTER_USER_REQUESTED,
      sagas.registerUserFlow
    ));

  expect(generator.next().value)
    .toEqual(takeEvery(
      constants.LOGIN_EMAIL_REQUESTED,
      sagas.loginEmailFlow
    ));

  expect(generator.next().value)
    .toEqual(takeEvery(
      constants.SAVE_PROFILE_REQUESTED,
      sagas.saveProfileFlow
    ));

  expect(generator.next().value)
    .toEqual(takeEvery(
      constants.UPDATE_PROFILE_REQUESTED,
      sagas.updateProfileFlow
    ));

  expect(generator.next().value)
    .toEqual(takeEvery(
      constants.GET_PROFILE_REQUESTED,
      sagas.getProfileFlow
    ));
});
