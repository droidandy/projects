import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import BenefitModal from '../components/BanefitModal';

configure({ adapter: new Adapter() });

describe('<BenefitModal />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
    });
    store = mockStore(initialState);
  });

  it('should render 4 columns', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitModal carrierName="Anthem" yearlyCPCost={2250000} yearlyAPCost={1870000} carrierAP={'123123123'} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.btmdivcost').length).toBe(6);
  });

  it('should render 8 columns', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitModal carrierName="Uhc" carrierAP="123" yearlyCPCost={4250000} yearlyAPCost={7870000} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.btmdivcost').length).toBe(18);
  });
});
