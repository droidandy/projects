import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import Client from '../';
import { changeAccessStatus } from '../Details/actions';
import { ACCESS_STATUS_WAITING } from '../Details/constants';

configure({ adapter: new Adapter() });

describe('<Client />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Client component with ACCESS_STATUS_STOP and not clientId', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Client params={{}} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('a').text()).toEqual('Choose a Client');
  });

  it('should render the Client component with ACCESS_STATUS_STOP with clientId', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Client params={{ clientId: '11' }} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('div.client').length).toBe(1);
  });

  it('should render the Client component with ACCESS_STATUS_WAITING', () => {
    store.dispatch(changeAccessStatus(ACCESS_STATUS_WAITING));
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Client params={{ clientId: '11' }} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('a').length).toBe(2);
  });
});
