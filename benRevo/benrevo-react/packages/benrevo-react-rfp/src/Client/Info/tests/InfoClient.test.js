import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../../../reducer/state';
import InfoClient from '../';

configure({ adapter: new Adapter() });

describe('<InfoClient />', () => {
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
      path: 'client',
    },
  ];
  it('should render the Info Client page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <InfoClient
          routes={routes}
        />
      </Provider>
    );

    renderedComponent.find('button.primary').simulate('click');

    renderedComponent.find('select').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('textarea').forEach((node) => {
      node.simulate('change');
    });

    renderedComponent.find('DatePicker').forEach((node) => {
      node.prop('onChange')(new Date());
    });

    expect(renderedComponent.find('input[name="clientName"]').length).toBe(1);
  });
});
