import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import {
  Overview,
  QuoteState,
} from '@benrevo/benrevo-react-quote';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import OverviewPage from './../OverviewPage';

configure({ adapter: new Adapter() });

describe('<OverviewPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
      presentation: QuoteState,
    });
    store = mockStore(initialState);
  });
  const section = 'medical';
  const carrier = {
    carrier: {
      carrierId: 1,
    },
  };
  it('should render the OverviewPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OverviewPage section={section} carrier={carrier} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(Overview).length).toBe(1);
  });
});
