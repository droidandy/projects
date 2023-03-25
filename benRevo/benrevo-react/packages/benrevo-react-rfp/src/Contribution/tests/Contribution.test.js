import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../../reducer/state';
import Contribution from '../';

configure({ adapter: new Adapter() });

describe('<Contribution />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
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
  it('should render the Contribution page for medical', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <Contribution
          routes={routes}
        />
      </Provider>
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    renderedComponent.find('input[type="radio"]').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('input[type="checkbox"]').simulate('change');

    renderedComponent.find('input[type="text"]').forEach((node) => {
      node.simulate('change');
    });

    expect(renderedComponent.find('TiersForm').length).toBe(1);
  });

  it('should render the Contribution page for dental', () => {
    routes[2].path = 'dental';
    const renderedComponent = mount(
      <Provider store={store}>
        <Contribution
          routes={routes}
        />
      </Provider>
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    expect(renderedComponent.find('TiersForm').length).toBe(1);
    expect(renderedComponent.find('button[name="contributionType"]').length).toBe(3);
  });
});
