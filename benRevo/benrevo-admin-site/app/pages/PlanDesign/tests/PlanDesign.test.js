import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import PlanDesign from '../.';

describe('<PlanDesign />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the Plan component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanDesign
            route={{
              name: 'upload',
              childRoutes: [
                {
                  path: 'upload',
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
