import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Brokerage from '../';
// import { getAsyncInjectors } from '../../../utils/asyncInjectors';

describe('<Brokerage />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Brokerage page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Brokerage />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.brokerage').length).toBe(1);
  });
});
