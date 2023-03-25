import React from 'react';
import { mount } from 'enzyme';
import { browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from '../../../store';
import PlanTable from '../components/PlanTable';

import HMO from '../components/HMO';
import PPO from '../components/PPO';
import HSA from '../components/HSA';
import DHMO from '../components/DHMO';
import DPPO from '../components/DPPO';
import Vision from '../components/Vision';

describe('<PlanTable />', () => {
  let store;
  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  const MedicalPlans = [
    HMO,
    PPO,
    HSA,
  ];

  const DentalPlans = [
    DHMO,
    DPPO,
  ];
  const VisionPlans = [
    Vision,
  ];

  const carrierHistory = [
    { carrierId: 1, name: 'AETNA', displayName: 'Aetna' },
    { carrierId: 3, name: 'ANTHEM_BLUE_CROSS', displayName: 'Anthem Blue Cross' },
    { carrierId: 6, name: 'CIGNA', displayName: 'Cigna' },
    { carrierId: 13, name: 'KAISER', displayName: 'Kaiser' },
  ];

  const networks = [
    { networkId: 2, name: 'AVN HMO', type: 'HMO' },
    { networkId: 4, name: 'Basic HMO', type: 'HMO' },
    { networkId: 3, name: 'Deductible HMO', type: 'HMO' },
    { networkId: 1, name: 'HMO', type: 'HMO' },
  ];

  MedicalPlans[0].selectedCarrier = { carrierId: 1, name: 'AETNA', displayName: 'Aetna' };
  MedicalPlans[1].selectedCarrier = { carrierId: 3, name: 'ANTHEM_BLUE_CROSS', displayName: 'Anthem Blue Cross' };
  MedicalPlans[2].selectedCarrier = { carrierId: 13, name: 'KAISER', displayName: 'Kaiser' };

  MedicalPlans[0].selectedNetwork = { networkId: 2, name: 'AVN HMO', type: 'HMO' };
  MedicalPlans[1].selectedNetwork = { networkId: 34, name: 'Full Network', type: 'PPO' };
  MedicalPlans[2].selectedNetwork = { networkId: 78, name: 'Entire Network', type: 'VOLLIFE' };

  DentalPlans[0].selectedCarrier = { carrierId: 6, name: 'CIGNA', displayName: 'Cigna' };
  DentalPlans[1].selectedCarrier = { carrierId: 6, name: 'CIGNA', displayName: 'Cigna' };
  DentalPlans[0].selectedNetwork = { networkId: 52, name: 'Entire Network', type: 'DPPO' };
  DentalPlans[1].selectedNetwork = { networkId: 60, name: 'Entire Network', type: 'DHMO' };

  VisionPlans[0].selectedCarrier = { carrierId: 3, name: 'ANTHEM_BLUE_CROSS', displayName: 'Anthem Blue Cross' };
  VisionPlans[0].selectedNetwork = { networkId: 133, name: 'Blue View Vision Voluntary', type: 'Vision' };

  it('should render the PlanTable component', () => {
    const loading = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanTable
            section={'medical'}
            updatePlanField={jest.fn()}
            carrierHistory={carrierHistory}
            networks={networks}
            loading={loading}
            plansTemplates={MedicalPlans}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.add-plan-table').length).toBe(1);
  });

  it('should render the three medical types of plans', () => {
    const loading = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanTable
            section={'medical'}
            updatePlanField={jest.fn()}
            loading={loading}
            plansTemplates={MedicalPlans}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.plan-table-type').length).toBe(3);
  });

  it('should render the two dental types of plans', () => {
    const loading = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanTable
            section={'dental'}
            updatePlanField={jest.fn()}
            loading={loading}
            plansTemplates={DentalPlans}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.plan-table-type').length).toBe(2);
  });

  it('should render the one vision type of plans', () => {
    const loading = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanTable
            section={'vision'}
            updatePlanField={jest.fn()}
            loading={loading}
            plansTemplates={VisionPlans}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.plan-table-type').length).toBe(1);
  });
});
