import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../store';
import AddCarrier from './../AddCarrier';

configure({ adapter: new Adapter() });

describe('<AddCarrier />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
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
  it('should render the AddCarrier component', () => {
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
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <AddCarrier
            selectCarrier={jest.fn()}
            carriers={rfpCarriers}
            selectedCarriers={selectedCarriers}
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.add-carrier-content').length).toBe(2);
  });

  it('should render the AddCarrier component', () => {
    const selectedCarriers = {
      medical: [
        {
          carrier: {
            carrierId: '123',
            carrierName: 'Name1',
          },
        },
      ],
      dental: [],
      vision: [],
    };
    const hideDental = false;
    const hideVision = false;
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <AddCarrier
            selectCarrier={jest.fn()}
            carriers={rfpCarriers}
            selectedCarriers={selectedCarriers}
            hideDental={hideDental}
            hideVision={hideVision}
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.show-more').length).toBe(18);
  });
});
