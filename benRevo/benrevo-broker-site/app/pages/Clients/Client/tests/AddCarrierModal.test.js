import React from 'react';
import { configure, mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from './../../../../store';
import AddCarrierModal from '../components/AddCarrierModal';

configure({ adapter: new Adapter() });

describe('<AddCarrierModal />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });
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
  const openModal = true;
  it('should render the AddCarrierModal component', () => {
    const renderedComponent = mount( // eslint-disable-line function-paren-newline
      <Provider store={store}>
        <IntlProvider locale="en">
          <AddCarrierModal
            products={{
              medical: true,
              dental: true,
              vision: true,
              life: true,
              std: true,
              ltd: true,
            }}
            selectCarrier={jest.fn()}
            selectedCarriers={selectedCarriers}
            carriers={rfpCarriers}
            openModal={openModal}
            closeModal={jest.fn()}
            addCarrier={jest.fn()}
          />
        </IntlProvider>
      </Provider>);
    expect(renderedComponent.find('.add-carrier-modal').length).toBe(1);
  });
});
