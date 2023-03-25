import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { initialState as authReducerState } from './../../../utils/authService/reducer';
import CarrierPage from './../';

configure({ adapter: new Adapter() });

describe('<CarrierPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
    });
    store = mockStore(initialState);
  });

  const route = {
    childRoutes: [],
  };

  it('should render the CarrierPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CarrierPage route={route} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('NavigationCarrier').length).toBe(1);
  });
});
