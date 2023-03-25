import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import reducer, { initialState as EmployerAppInitialState } from '../EmployerApp/reducer';
import {
} from '../constants';

describe('EmployerAppReducer', () => {
  let state;
  let store;
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  beforeAll(() => {
    const initialState = fromJS({
      main: EmployerAppInitialState,
    });
    store = mockStore(initialState);
    state = store.getState();
  });
  it('EmployerAppReducer', () => {
    const action = {};
    expect(reducer(undefined, action)).toEqual(state);
  });
});
