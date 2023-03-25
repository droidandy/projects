import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import ReactEcharts from 'echarts-for-react';
import configureStore from '../../../store';
import Chart from './../components/Chart';

configure({ adapter: new Adapter() });

describe('<Chart />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  it('should render the Chart page', () => {
    const loading = false;
    const chart = {};
    const clients = [];
    const filters = {
      difference: [],
      effectiveDate: [],
      carriers: [],
      sales: [],
      brokers: [],
      clientStates: [],
      presales: [],
      competitiveInfoCarrier: {
        name: '',
      },
    };
    const productsList = [];
    const maxDiff = 10;
    const minDiff = 1;
    const filterCarriers = [];
    const filterBrokerages = [];
    const filterSales = [];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Chart
            loading={loading}
            chart={chart}
            clients={clients}
            filters={filters}
            changeFilter={jest.fn()}
            getClients={jest.fn()}
            products={productsList}
            setFilters={jest.fn()}
            maxDiff={maxDiff}
            minDiff={minDiff}
            clearFilter={jest.fn()}
            filterCarriers={filterCarriers}
            filterBrokerages={filterBrokerages}
            filterSales={filterSales}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.card-main.card-chart').length).toBe(2);
    expect(renderedComponent.find('.chart-legend').length).toBe(0);
    expect(renderedComponent.find(ReactEcharts).length).toBe(0);
  });

  it('should render the Chart page loading', () => {
    const loading = true;
    const chart = {};
    const clients = [];
    const filters = {
      difference: [],
      effectiveDate: [],
      carriers: [],
      sales: [],
      brokers: [],
      clientStates: [],
      presales: [],
      competitiveInfoCarrier: {
        name: '',
      },
    };
    const productsList = [];
    const maxDiff = 10;
    const minDiff = 1;
    const filterCarriers = [];
    const filterBrokerages = [];
    const filterSales = [];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Chart
            loading={loading}
            chart={chart}
            clients={clients}
            filters={filters}
            changeFilter={jest.fn()}
            getClients={jest.fn()}
            products={productsList}
            setFilters={jest.fn()}
            maxDiff={maxDiff}
            minDiff={minDiff}
            clearFilter={jest.fn()}
            filterCarriers={filterCarriers}
            filterBrokerages={filterBrokerages}
            filterSales={filterSales}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.card-main.card-chart').length).toBe(2);
    expect(renderedComponent.find('.empty').length).toBe(1);
    expect(renderedComponent.find(ReactEcharts).length).toBe(0);
  });

  it('should render the Chart page with clients blocks', () => {
    const loading = false;
    const chart = { ranges: [] };
    const clients = [{ clientId: '123' }, { clientId: '234' }, { clientId: '345' }];
    const filters = {
      difference: [],
      effectiveDate: [],
      carriers: [],
      sales: [],
      brokers: [],
      clientStates: [],
      presales: [],
      competitiveInfoCarrier: {
        name: '',
      },
    };
    const productsList = [];
    const maxDiff = 10;
    const minDiff = 1;
    const filterCarriers = [];
    const filterBrokerages = [];
    const filterSales = [];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Chart
            loading={loading}
            chart={chart}
            clients={clients}
            filters={filters}
            changeFilter={jest.fn()}
            getClients={jest.fn()}
            products={productsList}
            setFilters={jest.fn()}
            maxDiff={maxDiff}
            minDiff={minDiff}
            clearFilter={jest.fn()}
            filterCarriers={filterCarriers}
            filterBrokerages={filterBrokerages}
            filterSales={filterSales}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.card-main.card-chart').length).toBe(2);
    expect(renderedComponent.find('.chart-legend').length).toBe(2);
    expect(renderedComponent.find(ReactEcharts).length).toBe(1);
  });
});
