import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import BenefitsBody from './../components/BenefitsBody';

configure({ adapter: new Adapter() });

describe('<BenefitsBody />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const bottomSeparatedBenefitsSysName = [
    'INDIVIDUAL_OOP_LIMIT',
    'INPATIENT_HOSPITAL',
    'EMERGENCY_ROOM',
  ];
  it('should render the BenefitsBody', () => {
    const item = MedicalPlans.plans[0].benefits[0];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsBody
            item={item}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            motionLink={''}
            carrierName={'Anthem'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.bottom-separated').length).toBe(2);
  });
  it('should render the BenefitsBody', () => {
    const item = MedicalPlans.plans[1].benefits[0];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsBody
            item={item}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            motionLink={''}
            carrierName={'Anthem'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.bottom-separated').length).toBe(2);
  });

  it('should render the BenefitsBody', () => {
    const item = MedicalPlans.plans[0].benefits[2];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsBody
            item={item}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            motionLink={''}
            carrierName={'Anthem'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.bottom-separated-light').length).toBe(0);
  });
});
