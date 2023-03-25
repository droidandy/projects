import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { RfpReducerState } from '@benrevo/benrevo-react-rfp';
import Info from './../Info';

configure({ adapter: new Adapter() });

describe('<Info />', () => {
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
      path: 'medical',
    },
    {
      path: 'medical',
    },
  ];
  it('should render the Info page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Info
          routes={routes}
        />
      </Provider>
    );

    expect(renderedComponent.find(Info).length).toBe(1);
  });
});
