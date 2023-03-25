import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import MenuList from '../Header/MenuList';

configure({ adapter: new Adapter() });

describe('<MenuList />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const location = '/';
  it('should render the MenuList component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <MenuList location={location} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.menu-list').length).toBe(1);
  });
});
