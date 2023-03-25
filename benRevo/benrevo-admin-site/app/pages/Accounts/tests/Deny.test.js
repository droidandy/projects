import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Deny from '../Deny';

describe('<Deny />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Deny component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Deny />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('textarea').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.column-header').length).toBe(2);
  });
});
