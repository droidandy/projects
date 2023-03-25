import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import Admin from './../';
import AdminComponent from './../Admin';
import { initialState as adminReducerState } from './../reducer';

configure({ adapter: new Adapter() });

describe('<AdminComponent />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({});
    store = mockStore(initialState);
  });

  const disclosure = {
    data: 'hnakwdhdkawd',
  };
  const loading = false;
  const configLoaded = true;

  it('should render the Admin component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AdminComponent
            disclosure={disclosure}
            loading={loading}
            changeForm={jest.fn()}
            formSubmit={jest.fn()}
            getConfig={jest.fn()}
            cancelForm={jest.fn()}
            configLoaded={configLoaded}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.admin').length).toBe(1);
  });
});

describe('<Admin />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

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
          <Admin />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.admin').length).toBe(1);
  });
});
