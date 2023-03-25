import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import configureStore from '../../../store';
import Persons from '../Persons';

describe('<Persons />', () => {
  let store;
  // beforeAll(() => {
  //   store = configureStore({}, browserHistory);
  // });

  it('should render the Loader with text Getting sales and presales', () => {
    store = configureStore({
      sales: {
        loading: true,
        saving: false,
        brokerages: [],
        personOfInterest: {},
        searchText: '',
        currentChildren: [],
        POICurrentRole: '',
        sales: [{ id: '1' }],
        presales: [{ id: '2' }],
        managers: [{ id: '3' }],
        renewalManagers: [{ id: '4' }],
        renewalSales: [{ id: '5' }],
      },
    }, browserHistory);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Persons />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.contains(<Loader indeterminate size="big">Getting sales and presales</Loader>)).toBe(true);
    expect(renderedComponent.find('.persons').length).toBe(1);
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });

  it('should render the personnel list section for testing', () => {
    window.requestAnimationFrame = jest.fn();
    store = configureStore({
      sales: {
        loading: false,
        saving: false,
        brokerages: [],
        personOfInterest: {},
        searchText: '',
        currentChildren: [],
        POICurrentRole: '',
        sales: [{ personId: '1', firstName: 'test', lastName: 'test', type: 'test' }],
        presales: [{ personId: '2', firstName: 'test', lastName: 'test', type: 'test' }],
        managers: [{ personId: '3', firstName: 'test', lastName: 'test', type: 'test' }],
        renewalManagers: [{ personId: '4', firstName: 'test', lastName: 'test', type: 'test' }],
        renewalSales: [{ personId: '5', firstName: 'test', lastName: 'test', type: 'test' }],
      },
    }, browserHistory);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Persons />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.persons').length).toBe(1);
    renderedComponent.find('.button').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
  });
});
