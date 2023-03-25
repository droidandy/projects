import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import PlansAnthem from '../PlansAnthem';
import Anthem from '../';

describe('<PlansAnthem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the PlansAnthem page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlansAnthem
            route={{
              name: 'clearValue',
              childRoutes: [
                {
                  path: 'calculator',
                },
              ],
            }}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.plans').length).toBe(1);
  });
});

describe('<Anthem />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Anthem page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Anthem
            route={{
              name: 'clearValue',
              childRoutes: [
                {
                  path: 'calculator',
                },
              ],
            }}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.plans').length).toBe(1);
  });
});

