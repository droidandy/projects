import { fromJS } from 'immutable';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { selectClientPageDomain, makeSelectClientPage, selectBrokerageList } from '../selectors';
import { initialState as clientsReducerState } from './../reducer';

describe('selectClientPageDomain', () => {
  it('should select the clients state', () => {
    const clients = fromJS({});
    const mockedState = fromJS({
      clients,
    });
    expect(selectClientPageDomain(mockedState)).toEqual(clients);
  });
});

describe('makeSelectClientPage', () => {
  let mockedState;
  beforeAll(() => {
    mockedState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
    });
  });

  it('should select the clients state', () => {
    const selectClientPage = makeSelectClientPage();
    expect(selectClientPage(mockedState)).toEqual(mockedState.get('clients').toJS());
  });
});

describe('selectBrokerageList', () => {
  let mockedState;

  beforeAll(() => {
    mockedState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
    });
  });

  it('should be sorted in alphabetical order', () => {
    mockedState = mockedState.setIn(['profile', 'brokerages'], fromJS([
      {
        id: 1,
        name: 'b',
      },
      {
        id: 2,
        name: 'c',
      },
      {
        id: 3,
        name: 'a',
      },
    ]));
    expect(selectBrokerageList(mockedState)).toEqual([
      {
        key: 3,
        value: 3,
        text: 'a',
      },
      {
        key: 1,
        value: 1,
        text: 'b',
      },
      {
        key: 2,
        value: 2,
        text: 'c',
      },
    ]);
  });
});
