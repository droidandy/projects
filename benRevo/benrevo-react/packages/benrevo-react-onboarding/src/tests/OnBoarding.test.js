import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { selectClient, clientsReducerState } from '@benrevo/benrevo-react-clients';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { initialState as initialOnBoardingMasterState } from './../reducer';
import OnBoarding from './../OnBoarding';

configure({ adapter: new Adapter() });

describe('<OnBoarding />', () => {
  const route = {
    childRoutes: [],
  };
  let store;
  const middlewares = [];
  const mockStore = configureStore(middlewares);

  beforeAll(() => {
    const initialState = fromJS({
      onBoarding: initialOnBoardingMasterState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the OnBoarding page has client.id', () => {
    store.dispatch(selectClient({ id: 1 }));
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OnBoarding route={route} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('Navigation').length).toBe(1);
  });

  it('should render the OnBoarding page does not have client.id', () => {
    store.dispatch(selectClient({ id: null }));

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OnBoarding route={route} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('Navigation').length).toBe(1);
  });
});
