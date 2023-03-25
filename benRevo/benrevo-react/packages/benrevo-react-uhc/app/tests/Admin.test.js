import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { Admin } from '@benrevo/benrevo-react-core';
import AdminPage from './../pages/Admin';

configure({ adapter: new Adapter() });

describe('<AdminPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  const adminReducerState = fromJS({
    loading: false,
    configLoaded: false,
    disclosureOrigin: {
      data: '',
      modifyBy: '',
      modifyDate: '',
      type: 'LANGUAGE',
    },
    disclosure: {
      data: '',
      modifyBy: '',
      modifyDate: '',
      type: 'LANGUAGE',
    },
  });
  beforeAll(() => {
    const initialState = fromJS({
      adminPage: adminReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the Admin page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AdminPage />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(Admin).length).toBe(1);
  });
});
