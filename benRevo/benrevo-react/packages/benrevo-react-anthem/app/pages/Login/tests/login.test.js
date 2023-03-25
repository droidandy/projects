import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import {
  SET_PROFILE,
  ERROR_EXPIRED,
  LoginPage,
} from '@benrevo/benrevo-react-core';
import configureStore from '../../../../app/store';
configure({ adapter: new Adapter() });


describe('<LoginPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const location = {
    state: {
      nextPathname: '/clients',
    },
  };
  const profile = {
    app_metadata: {
      roles: [],
    },
    brokerageRole: [],
    given_name: 'Test',
    family_name: 'TTT',
    name: 'Name',
    picture: {},
    brokerage: {},
    user_metadata: {},
  };
  it('should render its heading', () => {
    store.dispatch({ type: SET_PROFILE, profile });
    const renderedComponent = shallow(
      <LoginPage store={store} location={location} />
    );
    expect(renderedComponent.find('LoginPage').length).toEqual(1);
  });

  it('should render its heading', () => {
    store.dispatch({ type: ERROR_EXPIRED, payload: true });
    const renderedComponent = shallow(
      <LoginPage store={store} location={location} />
    );
    expect(renderedComponent.find('LoginPage').length).toEqual(1);
  });
});

describe('<LoginWrapper />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const location = {
    state: {
      nextPathname: '/clients',
    },
  };
  const profile = {
    app_metadata: {
      roles: [],
    },
    brokerageRole: [],
    given_name: 'Test',
    family_name: 'TTT',
    name: 'Name',
    picture: {},
    brokerage: {},
    user_metadata: {},
  };
  it('should render LoginPage', () => {
    store.dispatch({ type: SET_PROFILE, profile });
    const renderedComponent = shallow(
      <LoginPage store={store} location={location} />
    );
    expect(renderedComponent.find('LoginPage').length).toEqual(1);
  });
});
