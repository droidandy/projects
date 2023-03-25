import React from 'react';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { TeamMembers as Team } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { RfpReducerState as initialRfpMasterState } from '@benrevo/benrevo-react-rfp';


configure({ adapter: new Adapter() });

describe('<Team />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  const teamInitialState = {
    hasError: false,
    loading: false,
    members: [],
    selected: [],
  };

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      clients: clientsReducerState,
      team: teamInitialState,
    });
    store = mockStore(initialState);
  });
  const params = {
    clientId: '123',
  };
  const routes = [
    {},
    {
      childRoutes: [],
    },
    {
      childRoutes: [
        {
          path: 'medical',
        },
        {
          path: 'medical',
        },
        {
          path: 'test3',
        },
      ],
    },
    {
      path: 'medical',
    },
    {
      path: 'medical',
    },
    {
      path: 'medical',
    },
  ];
  it('should render the Team component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Team params={params} routes={routes} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find(Team).length).toBe(1);
  });
});
