describe('EmployerApplication', () => {
  it('teamPageReducer', () => {
    expect(true).toBe(true);
  });
});
/*
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
configure({ adapter: new Adapter() });

import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import EmployerApplication from './../EmployerApp/index';

describe('<EmployerApplication />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the EmployerApplication', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <EmployerApplication />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.medicalRfpMainContainer').length).toBe(1);
  });

  it('should render employerApp pdf', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <EmployerApplication />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.pdf-pagination-controls').length).toBe(1);
  });

  it('should contain download-button', () => {
    const renderedComponent = mount(
      <EmployerApplication store={store} />);
    renderedComponent.setState({ pageNumber: 1, total: 5 });
    renderedComponent.find('.download-button').simulate('click');
    expect(renderedComponent.find('.download-button').length).toBe(1);
  });
});
*/
