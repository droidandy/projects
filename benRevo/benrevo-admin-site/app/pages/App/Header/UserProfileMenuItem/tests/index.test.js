import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import { logout } from 'utils/authService/actions';
import configureStore from '../../../../../store';
import UserProfileMenuItem, { mapDispatchToProps } from '../index';

describe('<UserProfileMenuItem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <UserProfileMenuItem />
      </Provider>
    );
    expect(renderedComponent.contains(<UserProfileMenuItem />)).toBe(true);
  });

  describe('mapDispatchToProps', () => {
    describe('logout', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.logout).toBeDefined();
      });

      it('should dispatch logout when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.logout();
        expect(dispatch).toHaveBeenCalledWith(logout());
      });
    });
  });
});
