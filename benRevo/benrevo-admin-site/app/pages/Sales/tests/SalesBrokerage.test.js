import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import Brokerage from '../Brokerage';

describe('<Brokerage />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render Brokerage component', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Brokerage />
        </IntlProvider>
      </Provider>
    );

    renderedComponent.find('.button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.brokerage').length).toBe(1);
  });

  it('should render Brokerage component with dropdown data', () => {
    const storeBrokerage = store = configureStore({
      sales: {
        loading: false,
        saving: false,
        brokerage: { id: '123' },
        brokerages: [{ id: '123', name: 'test1' }],
        sales: [],
        presales: [],
      },
    }, browserHistory);
    const renderedComponent = mount(
      <Provider store={storeBrokerage}>
        <IntlProvider locale="en">
          <Brokerage />
        </IntlProvider>
      </Provider>
    );

    // expect(renderedComponent.find('.brokerage').length).toBe(1);
    renderedComponent.find('.dropdown').forEach((node) => {
      node.simulate('change', null, { value: '123' }, 'test');
    });
  });

  it('simulate save', () => {
    const storeBrokerage = store = configureStore({
      sales: {
        loading: false,
        saving: false,
        brokerage: { id: '123', presalesEmail: 'test', salesEmail: 'test4' },
        brokerages: [{ id: '123', name: 'test1' }],
        sales: [],
        presales: [],
      },
    }, browserHistory);
    const renderedComponent = mount(
      <Provider store={storeBrokerage}>
        <IntlProvider locale="en">
          <Brokerage />
        </IntlProvider>
      </Provider>
    );

    // expect(renderedComponent.find('.brokerage').length).toBe(1);
    renderedComponent.find('.button').forEach((node) => {
      node.simulate('click');
    });
  });

  it('loading', () => {
    const storeBrokerage = store = configureStore({
      sales: {
        loading: true,
        saving: false,
        brokerage: { id: '123', presalesEmail: 'test', salesEmail: 'test4' },
        brokerages: [],
        sales: [],
        presales: [],
      },
    }, browserHistory);
    const renderedComponent = mount(
      <Provider store={storeBrokerage}>
        <IntlProvider locale="en">
          <Brokerage />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.loader').length).toBe(1);
  });
});
