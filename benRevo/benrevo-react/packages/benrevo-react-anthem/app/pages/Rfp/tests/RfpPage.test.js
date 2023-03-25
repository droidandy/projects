import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { selectClient, clientsReducerState } from '@benrevo/benrevo-react-clients';
import configureStore from 'redux-mock-store';
import { RfpReducerState, CarrierState } from '@benrevo/benrevo-react-rfp';
import Rfp from '../';

configure({ adapter: new Adapter() });

describe('<Rfp />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      rfp: RfpReducerState,
      carrier: CarrierState,
    });
    store = mockStore(initialState);
  });

  it('should render the Rfp page has client.id', () => {
    store.dispatch(selectClient({
      id: 1,
      products: {
        medical: true,
        dental: true,
        vision: true,
        life: true,
        std: true,
        ltd: true,
      },
      virginCoverage: {
        medical: false,
        dental: false,
        vision: false,
        life: false,
        std: false,
        ltd: false,
      },
    }));

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Rfp />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('NavigationRfp').length).toBe(1);
  });

  it('should render the Rfp page does not have client.id', () => {
    store.dispatch(selectClient({
      id: null,
      products: {
        medical: true,
        dental: true,
        vision: true,
        life: true,
        std: true,
        ltd: true,
      },
      virginCoverage: {
        medical: false,
        dental: false,
        vision: false,
        life: false,
        std: false,
        ltd: false,
      },
    }));

    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Rfp />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('NavigationRfp').length).toBe(1);
  });
});
