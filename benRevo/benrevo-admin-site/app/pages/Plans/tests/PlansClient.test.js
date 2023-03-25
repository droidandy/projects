import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import PlansClient from '../';

describe('<PlansClient />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const route = {
    name: 'medical',
    childRoutes: [
      {
        path: 'medical',
      },
    ],
  };

  it('should render the PlansClient page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlansClient route={route} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.plans').length).toBe(1);
  });
});
