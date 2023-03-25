import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../../store';
import Header from '../';

describe('<Header />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Header', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Header location={'/'} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.app-header').length).toBe(1);
  });
});
