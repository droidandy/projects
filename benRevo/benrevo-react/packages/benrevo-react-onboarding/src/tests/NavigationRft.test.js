import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import NavigationRfp from '../Navigation';

configure({ adapter: new Adapter() });

describe('<NavigationRfp  />', () => {
  let store;
  const middlewares = [];
  const mockStore = configureStore(middlewares);

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  const client = {
    clientName: 'Client Name',
  };
  const routes = [
    { path: 'sendToCarrier' },
  ];

  it('should render the quote tab', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NavigationRfp client={client} routes={routes} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.responsive-nav').length).toBe(1);
  });
});
