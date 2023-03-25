import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import UserProfileMenuItem from '../Header/UserProfileMenuItem';

configure({ adapter: new Adapter() });

describe('<UserProfileMenuItem />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const location = '/';
  it('should render the UserProfileMenuItem component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <UserProfileMenuItem location={location} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.user-profile-menu-item').length).toBe(1);
  });
});
