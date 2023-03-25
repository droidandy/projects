import React from 'react';
import { mount, configure } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from '../../../store';
import SalesCharts from './../components/SalesCharts';

configure({ adapter: new Adapter() });

describe('<SalesCharts />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the SalesCharts Card', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <SalesCharts
            volumeGroups={[]}
            volumeGroup={'TEST'}
            changeVolumeGroup={jest.fn()}
            brokerVolume={[]}
            loading={false}
            chart={{}}
            clientsTotal={400}
            clients={[]}
            filters={{
              effectiveDate: [],
              difference: [-30, 100],
              carriers: [],
              product: 'MEDICAL',
              sales: [],
              presales: [],
              brokers: [],
              clientStates: ['QUOTED'],
              competitiveInfoCarrier: {},
            }}
            changeFilter={jest.fn()}
            getClients={jest.fn()}
            productsList={[]}
            setFilters={jest.fn()}
            maxDiff={123}
            minDiff={23}
            clearFilter={jest.fn()}
            filterCarriers={[]}
            filterBrokerages={[]}
            filterSales={[]}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.sales-view').hostNodes().length).toBe(1);
    // One .card-main from this component and one from Chart component
    expect(renderedComponent.find('.card-main').hostNodes().length).toBe(2);
  });
});
