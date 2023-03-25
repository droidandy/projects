import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import {
  Quote,
  QuoteState,
} from '@benrevo/benrevo-react-quote';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import QuotePage from './../pages/Quote/QuotePage';

configure({ adapter: new Adapter() });

describe('<QuotePage />', () => {
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

  it('should render the QuotePage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <QuotePage />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(Quote).length).toBe(1);
  });
});
