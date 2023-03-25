import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MedicalPlans2, authReducerState } from '@benrevo/benrevo-react-core';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import AlternativesColumn from './../components/AlternativesColumn';
import { initialPresentationMasterState } from './../../reducer/state';

configure({ adapter: new Adapter() });

describe('<AlternativesColumn />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
      profile: authReducerState,
    });
    store = mockStore(initialState);
  });

  const carrier = {
    carrier: {
      carrierName: 'anthem',
    },
  };
  const multiMode = false;
  const externalRX = false;
  const section = 'medical';
  const carrierName = 'Anthem';
  const motionLink = '/123/';
  const bottomSeparatedBenefitsSysName = [];
  const bottomSeparatedRxSysName = [];
  const showIntRX = true;
  const attributes = [];
  const activeIndex = [];
  const plan = MedicalPlans2.plans[1];
  const currentTotal = MedicalPlans2.plans[0].total;
  window.requestAnimationFrame = jest.fn();
  window.cancelAnimationFrame = jest.fn();
  // value={(plan.total > 0 && hasSelected) ? (plan.total - currentTotal) / currentTotal : 0}

  it('should render the Alternatives table medical1 with intRX', () => {
    const hasSelected = 0;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesColumn
            onAddBenefits={jest.fn()}
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={plan}
            deletePlan={jest.fn()}
            editPlan={jest.fn()}
            accordionClick={jest.fn()}
            setBorderColor={jest.fn()}
            selectNtPlan={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            attributes={Object.keys(attributes)}
            index={0}
            hasSelected={hasSelected}
            activeIndex={activeIndex}
            currentTotal={currentTotal}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showCost={MedicalPlans2.plans[0].cost}
            showBenefits={(MedicalPlans2.plans[0].benefits && MedicalPlans2.plans[0].benefits.length > 0)}
            showIntRX={showIntRX}
          />
        </IntlProvider>
      </Provider>
    );
    expect(isFinite((plan.total - (hasSelected ? currentTotal : 0)) / (hasSelected ? currentTotal : 0))).toBe(false);
    renderedComponent.find('.total-row.percent').forEach((node, index) => {
      if (index === 1) {
        expect(node.html().indexOf('0%')).not.toBe(-1);
      }
      expect(node.html().indexOf('∞')).toBe(-1);
    });
  });

  it('should render the Alternatives table medical1 with intRX', () => {
    const hasSelected = 1;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesColumn
            onAddBenefits={jest.fn()}
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={plan}
            deletePlan={jest.fn()}
            editPlan={jest.fn()}
            accordionClick={jest.fn()}
            setBorderColor={jest.fn()}
            selectNtPlan={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            attributes={Object.keys(attributes)}
            index={0}
            hasSelected={hasSelected}
            activeIndex={activeIndex}
            currentTotal={currentTotal}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showCost={MedicalPlans2.plans[0].cost}
            showBenefits={(MedicalPlans2.plans[0].benefits && MedicalPlans2.plans[0].benefits.length > 0)}
            showIntRX={showIntRX}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.total-row.percent').forEach((node, index) => {
      if (index === 1) {
        expect(node.html().indexOf('0.8%')).not.toBe(-1);
      }
      expect(node.html().indexOf('∞')).toBe(-1);
    });
  });
});
