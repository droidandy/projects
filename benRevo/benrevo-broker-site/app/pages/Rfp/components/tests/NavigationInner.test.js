import React from 'react';
import {
  mount,
  configure,
} from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../../store';
import NavigationInner from '../NavigationInner';
import messages from '../messages';


configure({ adapter: new Adapter() });

describe('<NavigationInner />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render Enrollment-modal component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <NavigationInner
            client={{}}
            products={{}}
            virginCoverage={{}}
            type="medical"
            clearCarrierData={jest.fn()}
            preview="medical"
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('span').length).toBe(3);

    const allNavTabs = renderedComponent.find('a');
    expect(allNavTabs.first().text()).toBe(messages.client.defaultMessage);
    expect(allNavTabs.last().text()).toBe('Send to Carrier');
    expect(allNavTabs.length).toBe(3);
  });
});
