/**
 * Test  sagas
 */
import sagaHelper from 'redux-saga-testing';
import CompanyDetailSagas from './../sagas';

describe('CompanyDetailSagas', () => {
  const defaultSaga = CompanyDetailSagas[0];
  const it = sagaHelper(defaultSaga());
  it('sagas', (result) => {
    expect(typeof result).toEqual('undefined');
    return {};
  });
});
