import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import Terms from '../';

configure({ adapter: new Adapter() });

describe('<Terms />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render the Terms page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Terms />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.rfpPageHeading').hostNodes().length).toBe(1);
  });
});
