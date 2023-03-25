import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState } from '@benrevo/benrevo-react-quote';
import clientsReducerState from './../reducer/clientsReducerState';
import { additionalState } from './../reducer/state';
import LifeStdLtdColumn from './../components/LifeStdLtdColumn';
import LifeStdLtdColumnComponent from './../components/LifeStdLtdColumn/LifeStdLtdColumn';
import detailedPlanLife2 from './detailedPlanLife2.json';
import { bottomSeparatedBenefitsSysName, bottomSeparatedRxSysName } from './../constants';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<LifeStdLtdColumn />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  const appReducerState = {
    loading: false,
    error: false,
    currentUser: false,
    showMobileNav: false,
    checkingRole: true,
    rfpcarriers: {
      medical: [],
      dental: [],
      vision: [],
      life: [],
      std: [],
      ltd: [],
    },
  };

  beforeAll(() => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';
  const multiMode = false;
  const carrier = {
    carrier: {
      name: 'Anthem',
    },
  };
  const currentPlan = {
    classes: [],
    benefits: [],
    rx: [],
    total: 0,
  };
  const accordionActiveIndex = [false, true, false, false];
  const emptyMatchPlanClasses = [];
  if (currentPlan && currentPlan.classes && currentPlan.classes.length > 0) {
    currentPlan.classes.forEach((classItem) => {
      const newClassItem = {
        javaclass: null,
        ancillaryClassId: null,
        name: classItem.name,
        monthlyBenefit: null,
        maxBenefit: null,
        maxBenefitDuration: null,
        eliminationPeriod: null,
        conditionExclusion: null,
        conditionExclusionOther: null,
        occupationDefinition: null,
        occupationDefinitionOther: null,
        abuseLimitation: null,
        abuseLimitationOther: null,
        premiumsPaid: null,
      };
      emptyMatchPlanClasses.push(newClassItem);
    });
  }
  const classTemplates = [
    {
      javaclass: null,
      ancillaryClassId: null,
      name: 'CLASS 1',
      monthlyBenefit: null,
      maxBenefit: null,
      maxBenefitDuration: null,
      eliminationPeriod: null,
      conditionExclusion: null,
      conditionExclusionOther: null,
      occupationDefinition: null,
      occupationDefinitionOther: null,
      abuseLimitation: null,
      abuseLimitationOther: null,
      premiumsPaid: null,
    },
    {
      javaclass: null,
      ancillaryClassId: null,
      name: 'CLASS 2',
      monthlyBenefit: null,
      maxBenefit: null,
      maxBenefitDuration: null,
      eliminationPeriod: null,
      conditionExclusion: null,
      conditionExclusionOther: null,
      occupationDefinition: null,
      occupationDefinitionOther: null,
      abuseLimitation: null,
      abuseLimitationOther: null,
      premiumsPaid: null,
    },
    {
      javaclass: null,
      ancillaryClassId: null,
      name: 'CLASS 3',
      monthlyBenefit: null,
      maxBenefit: null,
      maxBenefitDuration: null,
      eliminationPeriod: null,
      conditionExclusion: null,
      conditionExclusionOther: null,
      occupationDefinition: null,
      occupationDefinitionOther: null,
      abuseLimitation: null,
      abuseLimitationOther: null,
      premiumsPaid: null,
    },
    {
      javaclass: null,
      ancillaryClassId: null,
      name: 'CLASS 4',
      monthlyBenefit: null,
      maxBenefit: null,
      maxBenefitDuration: null,
      eliminationPeriod: null,
      conditionExclusion: null,
      conditionExclusionOther: null,
      occupationDefinition: null,
      occupationDefinitionOther: null,
      abuseLimitation: null,
      abuseLimitationOther: null,
      premiumsPaid: null,
    },
  ];
  const emptyMatchPlan = {
    type: 'matchPlan',
    carrierDisplayName: 'UHC',
    rates: {
      javaclass: null,
      ancillaryRateId: null,
      volume: null,
      monthlyCost: null,
      rateGuarantee: null,
      currentLife: null,
      renewalLife: null,
      currentADD: null,
      renewalADD: null,
      currentSL: null,
      renewalSL: null,
    },
    classes: emptyMatchPlanClasses.length > 0 ? emptyMatchPlanClasses : classTemplates,
  };

  it('should render the LifeStdLtdColumn', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <LifeStdLtdColumn
            section={section}
            multiMode={multiMode}
            carrier={carrier}
            plan={emptyMatchPlan}
            detailedPlan={detailedPlanLife2}
            accordionActiveIndex={accordionActiveIndex}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            downloadPlanBenefitsSummary={jest.fn()}
            accordionClick={jest.fn()}
            editBenefitInfo={jest.fn()}
            enterPlanInfo={jest.fn()}
            // emptyPlan
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(1);
    expect(renderedComponent.contains([<span>MATCH</span>])).toBe(true);
  });

  it('should render call selectPlanLife function if we tap on the matchPlan button', () => {
    let selectFlag = false;
    const selectPlanLife = () => {
      selectFlag = true;
    };
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <LifeStdLtdColumnComponent
            section={section}
            multiMode={multiMode}
            carrier={carrier}
            plan={detailedPlanLife2.plans[2]}
            detailedPlan={detailedPlanLife2}
            accordionActiveIndex={accordionActiveIndex}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            downloadPlanBenefitsSummary={jest.fn()}
            accordionClick={jest.fn()}
            editBenefitInfo={jest.fn()}
            enterPlanInfo={jest.fn()}
            selectPlanLife={selectPlanLife}
            // emptyPlan
          />
        </IntlProvider>
      </Provider>
    );
    // alt plan should be shown
    expect(renderedComponent.contains([<span>ALT</span>])).toBe(true);
    // the button is only one
    expect(renderedComponent.find('.additional.swap button').length).toBe(1);
    // tap the button
    renderedComponent.find('.additional.swap button').forEach((node) => {
      node.simulate('click');
    });
    // function was called correctly
    expect(selectFlag).toBe(true);
  });
});
