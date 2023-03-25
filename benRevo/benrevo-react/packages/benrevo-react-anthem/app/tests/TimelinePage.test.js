import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { TimelineData, authReducerState } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import configureStore from 'redux-mock-store';
import { TimelineReducerState, FETCH_TIMELINE_SUCCEEDED } from '@benrevo/benrevo-react-timeline';
import TimeLinePage from './../pages/Timeline';

configure({ adapter: new Adapter() });

describe('<TimeLinePage />', () => {
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

  it('should render the TimeLinePage page with data', () => {
    store.dispatch({ type: FETCH_TIMELINE_SUCCEEDED, payload: TimelineData });
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TimeLinePage params={{ clientId: '1' }} routes={routes} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(TimeLinePage).length).toBe(1);
  });
});
