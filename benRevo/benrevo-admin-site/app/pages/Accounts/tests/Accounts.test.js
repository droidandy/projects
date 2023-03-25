import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Accounts from '../';

describe('<Accounts />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Accounts component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Accounts />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.accounts').length).toBe(1);
  });
});
