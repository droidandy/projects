import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserProfileMenu from '../Header/UserProfileMenuItem/UserProfileMenu';
import { logout } from '../../../utils/authService/actions';
import { mapDispatchToProps } from '../Header/UserProfileMenuItem/index';
configure({ adapter: new Adapter() });

describe('<UserProfileMenuItem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore([])({});
  });

  it('should render itself', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <UserProfileMenu />
      </Provider>
    );
    expect(renderedComponent.contains(<UserProfileMenu />)).toBe(true);
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
