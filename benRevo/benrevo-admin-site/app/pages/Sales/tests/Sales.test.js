import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Sales from '../.';

describe('<Sales />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Plan component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Sales
            route={{
              name: 'persons',
              childRoutes: [
                {
                  path: 'persons',
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
