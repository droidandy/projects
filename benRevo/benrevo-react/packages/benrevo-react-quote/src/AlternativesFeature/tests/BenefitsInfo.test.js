import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import BenefitsInfo from './../components/BenefitsInfo';

configure({ adapter: new Adapter() });

describe('<BenefitsInfo />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const section = 'medical';
  const carrier = {
    carrier: {
      name: 'anthem',
    },
  };
  const currentPlan = MedicalPlans.plans[0];
  const currentPlanRX = MedicalPlans.rx[0];
  const currentRxPlanExists = true;
  it('should render the BenefitsInfo', () => {
    const multyMode = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsInfo
            currentRxPlanExists={currentRxPlanExists}
            offset={2}
            carrier={carrier}
            newPlan={currentPlan}
            newPlanRx={currentPlanRX}
            changePlanField={jest.fn()}
            networkIndex={'1'}
            addPlan={jest.fn()}
            cancelEditing={jest.fn()}
            section={section}
            planIndex={0}
            savePlan={jest.fn()}
            alternativesPlans={MedicalPlans}
            currentPlan={currentPlan}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            multiMode={multyMode}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.new-plan-next.plan-bebefits-editing').length).toBe(2);
  });
  it('should render the separate Benefits Row', () => {
    const multyMode = false;
    const currentPlan2 = MedicalPlans.plans[2];
    const currentPlanRX2 = MedicalPlans.rx[0];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsInfo
            currentRxPlanExists={currentRxPlanExists}
            offset={2}
            carrier={carrier}
            newPlan={currentPlan2}
            newPlanRx={currentPlanRX2}
            changePlanField={jest.fn()}
            networkIndex={'1'}
            addPlan={jest.fn()}
            cancelEditing={jest.fn()}
            section={section}
            planIndex={0}
            savePlan={jest.fn()}
            alternativesPlans={MedicalPlans}
            currentPlan={currentPlan2}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            multiMode={multyMode}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.new-row-grid.benefits.title.height-row-2').length).toBe(2);
  });
});
