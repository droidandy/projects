import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../store';
import Header from '../Header';

configure({ adapter: new Adapter() });

describe('<Header />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const location = '/';
  it('should render the Header component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Header location={location} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.app-header').length).toBe(1);
  });
});
