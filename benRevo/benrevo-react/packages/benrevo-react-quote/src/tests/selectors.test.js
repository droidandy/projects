import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialPresentationMasterState } from './../reducer/state';
import {
  selectPresentation,
  selectCurrentClient,
  selectClient,
  selectCarrier,
  selectContributions,
  selectEnrollment,
  selectCompare,
  selectOpenedOption,
  selectPage,
} from '../selectors';

describe('Presentation Selectors', () => {
  let presentationPage;
  let clients;
  let mockedState;
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
    presentationPage = store.getState().get('presentation');
    clients = store.getState().get('clients');
    mockedState = fromJS({
      presentation: initialPresentationMasterState,
      clients: clientsReducerState,
    });
  });

  it('should select the Presentation state', () => {
    expect(selectPresentation(mockedState)).toEqual(presentationPage);
  });

  it('should select the client state', () => {
    expect(selectCurrentClient()(mockedState)).toEqual(clients.get('current'));
  });

  describe('selectClient', () => {
    it('selectClient: no client id found', () => {
      expect(() => {
        selectClient()(mockedState);
      }).toThrow('No Client Id found');
    });

    it('selectClient: client id found', () => {
      mockedState = mockedState.setIn(['clients', 'current', 'id'], 1);
      expect(selectClient()(mockedState)).toEqual(mockedState.get('clients').get('current').toJS());
    });
  });

  it('selectCarrier', () => {
    expect(selectCarrier('medical')(mockedState)).toEqual(presentationPage.get('medical').get('mainCarrier').toJS());
  });

  it('selectContributions', () => {
    const mockedData = [{
      erContributionFormat: undefined,
      rfpQuoteOptionNetworkId: undefined,
      tier1EeFund: 0,
      tier1Enrollment: 0,
      tier1ErContribution: 1,
    }];

    mockedState = mockedState.setIn(['presentation', 'medical', 'openedOptionContributions', 0, 'contributions'], fromJS([{ proposedER: 1 }]));
    expect(selectContributions('medical', 0)(mockedState)).toEqual(mockedData);
  });

  it('selectEnrollment', () => {
    const mockedData = [{
      clientPlanId: 1,
      tier1Enrollment: 1,
    }];

    mockedState = mockedState
      .setIn(['presentation', 'medical', 'enrollment', 'contributions'], fromJS([]))
      .setIn(['presentation', 'medical', 'enrollment', 'networks'], fromJS([{ clientPlanId: 1 }]));

    mockedState = mockedState
      .setIn(['presentation', 'medical', 'enrollment', 'contributions', 0, 'values', 0, 'value'], 1);
    expect(selectEnrollment('medical')(mockedState)).toEqual(mockedData);
  });

  it('selectCompare', () => {
    expect(selectCompare('medical')(mockedState)).toEqual(presentationPage.get('medical').get('checkedOptions').toJS());
  });

  it('selectOpenedOption', () => {
    expect(selectOpenedOption('medical')(mockedState)).toEqual(presentationPage.get('medical').get('openedOption').toJS());
  });

  it('selectPage', () => {
    expect(selectPage('medical')(mockedState)).toEqual(presentationPage.get('medical').get('page').toJS());
  });
});
