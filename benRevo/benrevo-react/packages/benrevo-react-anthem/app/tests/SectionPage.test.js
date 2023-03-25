import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import {
  PresentationSection,
  QuoteState,
} from '@benrevo/benrevo-react-quote';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import SectionPage from './../pages/Quote/SectionPage';

configure({ adapter: new Adapter() });

describe('<SectionPage />', () => {
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
  const routes = [
    {},
    {},
    {
      path: 'medical',
    },
  ];

  it('should render the SectionPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <SectionPage section={section} routes={routes} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(PresentationSection).length).toBe(1);
  });
});
