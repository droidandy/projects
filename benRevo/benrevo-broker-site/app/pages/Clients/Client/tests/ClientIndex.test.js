import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../../store';
import Client from './../';

configure({ adapter: new Adapter() });

describe('<AdminPage />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Admin component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <Client params={{ clientId: '200' }} />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.client-page').length).toBe(1);
  });
});
