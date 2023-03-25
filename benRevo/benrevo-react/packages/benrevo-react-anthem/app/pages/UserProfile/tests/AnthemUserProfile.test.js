import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import { BENREVO_PATH } from '@benrevo/benrevo-react-core';
import configureStore from '../../../store';
import UserProfile from './../';

configure({ adapter: new Adapter() });

describe('<UserProfile />', () => {
  const browserHistory = useRouterHistory(createHistory)({
    basename: BENREVO_PATH,
  });
  const initialState = {};
  let store = {};
  beforeAll(() => {
    store = configureStore(initialState, browserHistory, {}, true);
  });

  it('should render the UserProfile Anthem', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UserProfile />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.anthem-user-profile').hostNodes().length).toBe(1);
  });
});
