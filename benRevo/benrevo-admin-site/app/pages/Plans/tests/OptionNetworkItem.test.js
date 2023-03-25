import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from '../../../store';
import OptionNetworkItem from '../Submit/components/OptionNetworkItem';

describe('<OptionNetworkItem />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const quoteNetworks = {
    medical: [],
  };
  const option1 = {};
  const anthem = true;

  it('should render the OptionNetworkItem page', () => {
    const item = {
      isKaiser: false,
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OptionNetworkItem
            key={0}
            category="medical"
            anthem={anthem}
            title={'Medical'}
            data={item}
            networks={quoteNetworks.medical}
            option1={option1}
            changeOption1={jest.fn()}
            changeOption1Match={jest.fn()}
            changeOption1Group={jest.fn()}
            changeUsage={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.data-table-body').length).toBe(1);
  });

  it('should render the OptionNetworkItem page networkList dropdown', () => {
    const item = {
      isKaiser: false,
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OptionNetworkItem
            key={0}
            category="medical"
            anthem={anthem}
            title={'Medical'}
            data={item}
            networks={quoteNetworks.medical}
            option1={option1}
            changeOption1={jest.fn()}
            changeOption1Group={jest.fn()}
            changeOption1Match={jest.fn()}
            changeUsage={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('Dropdown').length).toBe(3);
  });

  it('should render the OptionNetworkItem page without networkList dropdown', () => {
    const item = {
      isKaiser: true,
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OptionNetworkItem
            key={0}
            category="kaiser"
            anthem={anthem}
            title={'Medical'}
            data={item}
            networks={quoteNetworks.medical}
            option1={option1}
            changeOption1={jest.fn()}
            changeOption1Match={jest.fn()}
            changeOption1Group={jest.fn()}
            changeUsage={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('Dropdown').length).toBe(2);
  });
});
