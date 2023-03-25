import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ManagerClients from '../components/ManagerClients';

configure({ adapter: new Adapter() });

describe('<ManagerClients />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({});
    store = mockStore(initialState);
  });
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
  const sort = {};
  const selectClient = jest.fn();
  const onClientsSort = jest.fn();
  const changeUserCount = jest.fn();
  const changePage = jest.fn();
  const loading = false;
  const rfpRouteFailed = false;
  const presentationRouteFailed = false;
  const isGA = false;

  it('should render ManagerClients page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <ManagerClients
          clients={clients}
          sort={sort}
          selectClient={selectClient}
          onClientsSort={onClientsSort}
          changeUserCount={changeUserCount}
          changePage={changePage}
          loading={loading}
          rfpRouteFailed={rfpRouteFailed}
          presentationRouteFailed={presentationRouteFailed}
          isGA={isGA}
        />
      </Provider>
    );
    renderedComponent.find('Table.HeaderCell').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.clients.section-wrap').length).toBe(2);
  });
});
