import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import PropTypes from 'prop-types';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { authReducerState } from '@benrevo/benrevo-react-core';
import AppPage from './../pages/App';

configure({ adapter: new Adapter() });

describe('<AppPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  const notificationsReducerState = [];
  const globalReducerState = fromJS({
    loading: false,
    error: false,
    currentUser: false,
    showMobileNav: false,
    checkingRole: true,
    feedbackModalOpen: false,
  });
  const location = {
    pathname: '/anthem',
  };
  const mixpanel = {};
  const routes = [
    { name: 'home' },
    { name: 'anthem' },
  ];
  beforeAll(() => {
    const initialState = fromJS({
      global: globalReducerState,
      profile: authReducerState,
      notifications: notificationsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the AppPage page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AppPage
            location={location}
            mixpanel={mixpanel}
            routes={routes}
          />
        </IntlProvider>
      </Provider>, {
        context: { mixpanel: { track: jest.fn() } },
        childContextTypes: { mixpanel: PropTypes.object },
      },
    );
    expect(renderedComponent.find(AppPage).length).toBe(1);
  });
});
