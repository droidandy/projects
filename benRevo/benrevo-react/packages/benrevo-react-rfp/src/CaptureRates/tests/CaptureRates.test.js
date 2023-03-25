import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialRfpMasterState } from './../../reducer/state';
import CaptureRates from '../';

configure({ adapter: new Adapter() });

describe('<CaptureRates />', () => {
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
  it('should render the TiersForm for Medical', () => {
    routes[3].path = 'medical';
    const renderedComponent = mount(
      <Provider store={store}>
        <CaptureRates
          routes={routes}
        />
      </Provider>
    );
    renderedComponent.find('button.primary').simulate('click');
    renderedComponent.find('button.basic').simulate('click');
    expect(renderedComponent.find('TiersForm').length).toBe(2);
  });

  it('should render the TiersForm for Dental', () => {
    routes[3].path = 'dental';
    routes[2].childRoutes[1].path = 'dental';
    const renderedComponent = mount(
      <Provider store={store}>
        <CaptureRates
          routes={routes}
        />
      </Provider>
    );

    expect(renderedComponent.find('TiersForm').length).toBe(2);
  });

  it('should render the TiersForm for Vision', () => {
    routes[3].path = 'vision';
    routes[2].childRoutes[1].path = 'vision';
    const renderedComponent = mount(
      <Provider store={store}>
        <CaptureRates
          routes={routes}
        />
      </Provider>
    );

    expect(renderedComponent.find('TiersForm').length).toBe(2);
  });
});
