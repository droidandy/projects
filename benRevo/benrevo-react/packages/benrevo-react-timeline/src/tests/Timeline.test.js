import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { TimelineData, authReducerState } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import configureStore from 'redux-mock-store';
import { initialState as TimelineReducerState } from '../reducer';
import Timeline from '../Timeline';
import {
  FETCH_TIMELINE_SUCCEEDED,
} from '../constants';

configure({ adapter: new Adapter() });

describe('<Timeline />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
      brokerageRole: [],
      clients: clientsReducerState,
      timeline: TimelineReducerState,
    });
    store = mockStore(initialState);
  });

  const routes = [
    {},
    {
      path: 'client',
    },
  ];

  it('should render the Timeline page with data', () => {
    store.dispatch({ type: FETCH_TIMELINE_SUCCEEDED, payload: TimelineData });
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Timeline params={{ clientId: '1' }} routes={routes} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('TableItem').length).toBe(0);
  });

  it('should render the Timeline page without data', () => {
    store.dispatch({ type: FETCH_TIMELINE_SUCCEEDED, payload: [] });

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Timeline params={{ clientId: '1' }} routes={routes} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('div').length).toBe(1);
  });
});
