import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import { initialState as authReducerState } from './../../../utils/authService/reducer';
import CarrierHome from './../Home';

configure({ adapter: new Adapter() });

describe('<CarrierHome />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
    });
    store = mockStore(initialState);
  });
  it('should render the CarrierHome', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CarrierHome />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.carrier-home').length).toBe(1);
  });
});
