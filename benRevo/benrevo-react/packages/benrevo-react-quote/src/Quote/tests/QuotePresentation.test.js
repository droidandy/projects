import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import QuotePresentation from '../';

configure({ adapter: new Adapter() });

describe('<QuotePresentation />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: initialPresentationMasterState,
      profile: authReducerState,
    });
    store = mockStore(initialState);
    window.requestAnimationFrame = jest.fn();
  });

  const routes = [
    {},
    {},
    {},
  ];
  const discounts = { total: 1 };

  it('should render the QuotePresentation', () => {
    routes[2].path = 'medical';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <QuotePresentation routes={routes} discounts={discounts} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.presentation-quote').length).toBe(1);
  });

  it('should render the QuotePresentation rows', () => {
    routes[2].path = 'medical';
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <QuotePresentation routes={routes} discounts={discounts} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.quoteRow').length).toBe(6);
  });
});
