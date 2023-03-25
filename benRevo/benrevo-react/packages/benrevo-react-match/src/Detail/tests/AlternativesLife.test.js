import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState } from '@benrevo/benrevo-react-quote';
import clientsReducerState from './../../reducer/clientsReducerState';
import { additionalState } from './../../reducer/state';
import AlternativesLife from './../components/AlternativesLife';
import detailedPlanLife from './detailedPlanLife.json';
import detailedPlanLtd from './detailedPlanLtd.json';
import detailedPlanStd from './detailedPlanStd.json';

export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<AlternativesLife />', () => {
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

  const section = 'life';
  const planList = false;

  it('should render the AlternativesLife', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesLife
            section={section}
            detailedPlan={{}}
            planList={planList}
            toggleModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
  });

  it('should render the Alternatives life', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesLife
            section={section}
            detailedPlan={detailedPlanLife}
            planList={planList}
            toggleModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
    expect(renderedComponent.find('.additional').length).toBe(10);
    expect(renderedComponent.find('.additional.more-less').length).toBe(6);
    expect(renderedComponent.find('.additional.selected').length).toBe(2);
    expect(renderedComponent.find('.additional.swap').length).toBe(2);
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(3);
  });

  it('should render the Alternatives ltd', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesLife
            section={section}
            detailedPlan={detailedPlanLtd}
            planList={planList}
            toggleModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
    expect(renderedComponent.find('.additional').length).toBe(10);
    expect(renderedComponent.find('.additional.more-less').length).toBe(6);
    expect(renderedComponent.find('.additional.selected').length).toBe(2);
    expect(renderedComponent.find('.additional.swap').length).toBe(2);
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(3);
  });

  it('should render the Alternatives std', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesLife
            section={section}
            detailedPlan={detailedPlanStd}
            planList={planList}
            toggleModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
    expect(renderedComponent.find('.additional').length).toBe(10);
    expect(renderedComponent.find('.additional.more-less').length).toBe(6);
    expect(renderedComponent.find('.additional.selected').length).toBe(2);
    expect(renderedComponent.find('.additional.swap').length).toBe(2);
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(3);
  });

  it('should render the Alternatives life with empty column', () => {
    const detailedPlan = detailedPlanLife;
    detailedPlanLife.plans.forEach((plan, index) => {
      if (plan.selectedSecond) {
        detailedPlan.plans.splice(index, 1);
      }
    });
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesLife
            section={section}
            detailedPlan={detailedPlan}
            planList={planList}
            toggleModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
    expect(renderedComponent.find('.additional').length).toBe(6);
    expect(renderedComponent.find('.additional.more-less').length).toBe(4);
    expect(renderedComponent.find('.additional.selected').length).toBe(2);
    expect(renderedComponent.find('.additional.swap').length).toBe(0);
    expect(renderedComponent.find('.alt-plan-empty').length).toBe(2);
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(2);
  });

  it('should render the Alternatives life with current empty column', () => {
    const detailedPlan = detailedPlanLife;
    detailedPlanLife.plans.forEach((plan, index) => {
      if (plan.type === 'current') {
        detailedPlan.plans.splice(index, 1);
      }
    });
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesLife
            section={section}
            detailedPlan={detailedPlan}
            planList={planList}
            toggleModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alternatives-short').length).toBe(2);
    expect(renderedComponent.find('.additional').length).toBe(4);
    expect(renderedComponent.find('.additional.more-less').length).toBe(2);
    expect(renderedComponent.find('.additional.selected').length).toBe(2);
    expect(renderedComponent.find('.additional.swap').length).toBe(0);
    expect(renderedComponent.find('.current-empty').length).toBe(1);
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(2);
  });
});
