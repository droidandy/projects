import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import CreateAccounts from '../CreateAccounts';

describe('<CreateAccounts />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the CreateAccounts component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CreateAccounts />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.create-accounts').length).toBe(1);
  });
});
