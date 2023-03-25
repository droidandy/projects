import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Plans from '../.';

describe('<Plans />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Plan component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Plans
            route={{
              name: 'files',
              childRoutes: [
                {
                  path: 'files',
                },
              ],
            }}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.responsive-nav').length).toBe(1);
  });
});
