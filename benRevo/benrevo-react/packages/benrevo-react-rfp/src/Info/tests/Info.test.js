import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../../reducer/state';
import Info from './../';

configure({ adapter: new Adapter() });

describe('<Info />', () => {
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
  it('should render the Info page', () => {
    routes[1].path = 'medical';
    const renderedComponent = mount(
      <Provider store={store}>
        <Info
          routes={routes}
          showPEPM
        />
      </Provider>
    );

    renderedComponent.find('input[name="commission"]').simulate('change');

    renderedComponent.find('button.primary').simulate('click');
    // renderedComponent.find('button.basic').simulate('click');

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });

    renderedComponent.find('button[name="addAnotherCarrier"]').simulate('click');

    expect(renderedComponent.find('button.primary').length).toBe(1);
  });
});
