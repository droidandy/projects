import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import Quote from './../Client/Quote';
import { initialRfpMasterState } from './../reducer/state';

configure({ adapter: new Adapter() });

describe('<Quote />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      rfp: initialRfpMasterState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  const routes = [
    {
      path: '',
    },
    {
      path: '',
    },
    {
      path: 'medical',
    },
  ];

  it('should render the Quote', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Quote
            routes={routes}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.rfpClientQuote').hostNodes().length).toBe(1);
  });
});
