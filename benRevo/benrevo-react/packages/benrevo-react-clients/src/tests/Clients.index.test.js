import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { initialState as clientsReducerState } from './../../src/reducer';
import {
  FETCH_CLIENTS_SUCCEEDED,
} from '../constants';
import ClientPage from '../Clients';

configure({ adapter: new Adapter() });

describe('<ClientPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  const clients = [
    {
      id: 1,
      clientName: 'Atom Biotech',
      brokerId: 1,
      employeeCount: 65,
      participatingEmployees: 160,
      sicCode: '35456',
      address: '123 some address',
      addressComplementary: 'unit 1290',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      minimumHours: 35,
      effectiveDate: '05/01/2017',
      dueDate: '05/01/2017',
      lastVisited: '03/25/2017',
      clientState: 'RFP_SUBMITTED',
      membersCount: 180,
      retireesCount: 0,
      outToBidReason: 'Looking for something that is more competitive',
      clientMembers: [{ fullName: 'Test' }],
    },
    {
      id: 2,
      clientName: 'Atom Biotech 2',
      brokerId: 1,
      employeeCount: 65,
      participatingEmployees: 160,
      sicCode: '35456',
      address: '123 some address',
      addressComplementary: 'unit 1290',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      minimumHours: 35,
      effectiveDate: '05/01/2017',
      dueDate: '05/01/2017',
      lastVisited: '03/25/2017',
      clientState: 'RFP_STARTED',
      membersCount: 180,
      retireesCount: 0,
      outToBidReason: 'Looking for something that is more competitive',
      clientMembers: [{ fullName: 'Test' }],
    },
    {
      id: 3,
      clientName: 'Atom Biotech 3',
      brokerId: 1,
      employeeCount: 65,
      participatingEmployees: 160,
      sicCode: '35456',
      address: '123 some address',
      addressComplementary: 'unit 1290',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      minimumHours: 35,
      effectiveDate: '05/01/2017',
      dueDate: '05/01/2017',
      lastVisited: '03/25/2017',
      clientState: 'QUOTED',
      membersCount: 180,
      retireesCount: 0,
      outToBidReason: 'Looking for something that is more competitive',
      clientMembers: [{ fullName: 'Test' }],
    },
    {
      id: 4,
      clientName: 'Atom Biotech 4',
      brokerId: 1,
      employeeCount: 65,
      participatingEmployees: 160,
      sicCode: '35456',
      address: '123 some address',
      addressComplementary: 'unit 1290',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      minimumHours: 35,
      effectiveDate: '05/01/2017',
      dueDate: '05/01/2017',
      lastVisited: '03/25/2017',
      clientState: 'SUBMITTED_FOR_APPROVAL',
      membersCount: 180,
      retireesCount: 0,
      outToBidReason: 'Looking for something that is more competitive',
      clientMembers: [{ fullName: 'Test' }],
    },
    {
      id: 5,
      clientName: 'Atom Biotech 5',
      brokerId: 1,
      employeeCount: 65,
      participatingEmployees: 160,
      sicCode: '35456',
      address: '123 some address',
      addressComplementary: 'unit 1290',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      minimumHours: 35,
      effectiveDate: '05/01/2017',
      dueDate: '05/01/2017',
      lastVisited: '03/25/2017',
      clientState: 'ON_BOARDING',
      membersCount: 180,
      retireesCount: 0,
      outToBidReason: 'Looking for something that is more competitive',
      clientMembers: [{ fullName: 'Test' }],
    },
    {
      id: 6,
      clientName: 'Atom Biotech 6',
      brokerId: 1,
      employeeCount: 65,
      participatingEmployees: 160,
      sicCode: '35456',
      address: '123 some address',
      addressComplementary: 'unit 1290',
      city: 'San Diego',
      state: 'CA',
      zip: '92101',
      minimumHours: 35,
      effectiveDate: '05/01/2017',
      dueDate: '05/01/2017',
      lastVisited: '03/25/2017',
      clientState: 'POLICY_FINALIZED',
      membersCount: 180,
      retireesCount: 0,
      outToBidReason: 'Looking for something that is more competitive',
      clientMembers: [{ fullName: 'Test' }],
    },
  ];

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  const showSubmitRfp = true;
  const showSearchForClientTop = true;
  const brokerClientsTimeline = true;

  it('should render its heading', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <ClientPage
          showSubmitRfp={showSubmitRfp}
          showSearchForClientTop={showSearchForClientTop}
          brokerClientsTimeline={brokerClientsTimeline}
        />
      </Provider>
    );
    expect(renderedComponent.contains(
      <ClientPage
        showSubmitRfp={showSubmitRfp}
        showSearchForClientTop={showSearchForClientTop}
        brokerClientsTimeline={brokerClientsTimeline}
      />)).toBe(true);
  });

  it('should present the client page with data', () => {
    store.dispatch({ type: FETCH_CLIENTS_SUCCEEDED, payload: clients });
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientPage
            showSubmitRfp={showSubmitRfp}
            showSearchForClientTop={showSearchForClientTop}
            brokerClientsTimeline={brokerClientsTimeline}
          />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('th').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('div').length).toBeGreaterThan(0);
  });

  it('should present the client page without data', () => {
    store.dispatch({ type: FETCH_CLIENTS_SUCCEEDED, payload: [] });
    // store.dispatch({ type: SET_PROFILE, profile: { brokerageRole: 'user', app_metadata: {} } });
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientPage
            showSubmitRfp={showSubmitRfp}
            showSearchForClientTop={showSearchForClientTop}
            brokerClientsTimeline={brokerClientsTimeline}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.clients-empty').length).toBe(0);
  });
});
