import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { RfpReducerState } from '@benrevo/benrevo-react-rfp';
import Contribution from './../Contribution';

configure({ adapter: new Adapter() });

describe('<Contribution />', () => {
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
    {
      childRoutes: [],
    },
    {
      path: 'medical',
    },
  ];
  it('should render the Info Contribution page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Contribution
          routes={routes}
        />
      </Provider>
    );

    expect(renderedComponent.find(Contribution).length).toBe(1);
  });
});
