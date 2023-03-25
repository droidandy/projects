import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { browserHistory } from 'react-router';
import configureStore from '../../../store';

import LoginPage from '../index';

configure({ adapter: new Adapter() });

describe('<LoginPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const location = {
    state: {
      nextPathname: '/plans',
    },
  };

  it('should render its heading', () => {
    const renderedComponent = shallow(
      <LoginPage store={store} location={location} />
    );
    expect(renderedComponent.find('LoginPage').length).toEqual(1);
  });

  it('should render its heading', () => {
    const renderedComponent = shallow(
      <LoginPage store={store} location={location} />
    );
    expect(renderedComponent.find('Icon').length).toEqual(0);
  });
});
