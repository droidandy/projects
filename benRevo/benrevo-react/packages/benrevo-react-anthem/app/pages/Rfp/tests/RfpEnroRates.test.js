import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { RfpReducerState } from '@benrevo/benrevo-react-rfp';
import EnroRates from './../EnroRates';

configure({ adapter: new Adapter() });

describe('<EnroRates />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: RfpReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });
  const routes = [
    {},
    {},
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
  ];
  it('should render the EnroRates page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <EnroRates
          routes={routes}
        />
      </Provider>
    );
    expect(renderedComponent.find(EnroRates).length).toBe(1);
  });
});
