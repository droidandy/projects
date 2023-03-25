import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../../store';
import MarketingStatus from '../components/MarketingStatus';

configure({ adapter: new Adapter() });

describe('<MarketingStatus />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
  const openModal = true;
  const rfpCarriers = {
    medical: [],
    dental: [],
    vision: [],
    life: [],
    vol_life: [],
    std: [],
    vol_std: [],
    ltd: [],
    vol_ltd: [],
  };
  const selectedCarriers = {
    medical: [],
    dental: [],
    vision: [],
    life: [],
    vol_life: [],
    std: [],
    vol_std: [],
    ltd: [],
    vol_ltd: [],
  };
  const marketingStatusList = [];
  const loadingMarketingStatusList = false;
  const clientId = '1';
  it('should render the MarketingStatus component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <MarketingStatus
            products={{
              medical: true,
              dental: true,
              vision: true,
              life: true,
              std: true,
              ltd: true,
            }}
            selectCarrier={jest.fn()}
            openModal={openModal}
            rfpCarriers={rfpCarriers}
            selectedCarriers={selectedCarriers}
            marketingStatusList={marketingStatusList}
            closeModal={jest.fn()}
            addCarrier={jest.fn()}
            openAddCarrierModal={jest.fn()}
            updateMarketingStatusItem={jest.fn()}
            loadingMarketingStatusList={loadingMarketingStatusList}
            clientId={clientId}
            deleteCarrier={jest.fn()}
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.marketing-status').length).toBe(1);
  });
});
