import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { IntlProvider } from 'react-intl';
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
    window.requestAnimationFrame = jest.fn();
    window.cancelAnimationFrame = jest.fn();
  });

  it('should render the newPlanTable defined table', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UserProfile />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.anthem-user-profile').length).toBe(2);
  });

  it('should render the newPlanTable defined table', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UserProfile />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('button').length).toBe(1);
  });

  it('should render the newPlanTable defined table 3', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <UserProfile />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change', { target: { value: 'Blablabla' } });
    });
    renderedComponent.find('.button').simulate('click');
    expect(renderedComponent.find('.anthem-user-profile').length).toBe(2);
  });

  const userMetadata2 = {
    firstName: 'Blablabla',
    lastName: 'Tilitili',
  };

  it('should render the newPlanTable defined table 4', () => {
    const renderedComponent = mount(
      <UserProfile store={store} firstName={userMetadata2.firstName} />
    );
    renderedComponent.setProps(userMetadata2);
    expect(renderedComponent.find('input[name="firstName"]').prop('value')).toBe('Blablabla');
  });
});
