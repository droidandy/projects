import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Review from '../Review';

describe('<Review />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Review component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Review />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.plans-review').length).toBe(1);
  });

  it('should render the Review items', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Review />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('ReviewItem').length).toBe(3);
  });
});
