import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { ExportClient, clientsReducerState } from '@benrevo/benrevo-react-clients';
import { authReducerState } from '@benrevo/benrevo-react-core';
import ClientExport from './../pages/Client/Export';

configure({ adapter: new Adapter() });

describe('<ClientExport />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });
  it('should render the Client page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ClientExport />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(ExportClient).length).toBe(1);
  });
});
