import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import HomePage from '../';
// import { getAsyncInjectors } from '../../../utils/asyncInjectors';

describe('<HomePage />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the HomePage page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <HomePage />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.clients').length).toBe(1);
  });
});
