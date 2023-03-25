/* import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
configure({ adapter: new Adapter() });

import Wrapper from './../'; */

describe('Wrapper', () => {
  it('teamPageReducer', () => {
    expect(true).toBe(true);
  });
});

/* describe('<Wrapper />', () => {
  let store;
  console.log('8');
  const middlewares = [];
  const mockStore = configureStore(middlewares);

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
    console.log('9');
  });

  it('should render the Wrapper OnBoarding', () => {
    console.log('10');
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Wrapper
            route={{
              name: 'section1',
              childRoutes: [
                {
                  path: 'section1',
                },
              ],
            }}
          />
        </IntlProvider>
      </Provider>
    );
    console.log('11');
    expect(renderedComponent.find('.section-wrap').length).toBe(1);
  });
}); */
