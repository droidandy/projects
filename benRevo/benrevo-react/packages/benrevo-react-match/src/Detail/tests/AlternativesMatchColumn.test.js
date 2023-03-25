import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState, PLAN_SECOND_SELECT, PLAN_SELECT } from '@benrevo/benrevo-react-quote';
import clientsReducerState from './../../reducer/clientsReducerState';
import { additionalState } from './../../reducer/state';
import AlternativesColumn from './../../components/AlternativesColumn';
import { bottomSeparatedBenefitsSysName, bottomSeparatedRxSysName } from './../../constants';
// import { selectSecondPlan } from './../../actions';
import mockCurrentPlan from './currentPlan.json';
import mockDetailedPlan from './detailedPlan.json';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<AlternativesColumn />', () => {
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

  beforeEach(() => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';
  const carrierName = 'Anthem';
  const motionLink = 'https://motionLink.com';
  const multiMode = false;
  const carrier = {
    carrier: {
      name: 'Anthem',
    },
  };
  const activeIndex = [false, false, false, false];
  const attributes = [];
  const externalRX = false;
  const showIntRX = false;
  const showBenefits = false;
  const rfpQuoteOptionNetworkId = 1;
  const currentPlan = {
    cost: [],
    benefits: [],
    rx: [],
    total: 0,
  };

  it('should render the AlternativesColumn', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesColumn
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={currentPlan}
            editPlan={jest.fn()}
            accordionClick={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            attributes={Object.keys(attributes)}
            currentTotal={currentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={jest.fn()}
            isCurrentPlan
            accordionActiveIndex={activeIndex}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(1);
  });

  it('should call addAlternativePlan action with actionType select (selectAltPlan)', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesColumn
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={mockDetailedPlan.secondNewPlan}
            editPlan={jest.fn()}
            accordionClick={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            attributes={Object.keys(attributes)}
            currentTotal={mockCurrentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={jest.fn()}
            repalceButtons
            thirdColumn
            accordionActiveIndex={activeIndex}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.add-alternative button').forEach((node) => {
      node.simulate('click');
    });
    const plan = mockDetailedPlan.secondNewPlan;
    const rfpQuoteNetworkPlanId = mockDetailedPlan.rfpQuoteNetworkPlanId;
    const actionType = 'select';
    const index = 0;
    const expectedActions = [
      {
        meta: {
          section,
        },
        type: PLAN_SECOND_SELECT,
        payload: {
          plan,
          rfpQuoteNetworkPlanId,
          rfpQuoteOptionNetworkId,
          actionType,
          index,
        },
      },
    ];
    expect(store.getActions()).toEqual(expectedActions);
    expect(renderedComponent.find('.add-alternative').length).toBe(1);
  });

  it('should call selectPlan action with actionType select (replace match)', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesColumn
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={mockDetailedPlan.secondNewPlan}
            editPlan={jest.fn()}
            accordionClick={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            attributes={Object.keys(attributes)}
            currentTotal={mockCurrentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={jest.fn()}
            repalceButtons
            thirdColumn
            accordionActiveIndex={activeIndex}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.replace-match button').forEach((node) => {
      node.simulate('click');
    });
    const expectedActions = [
      {
        meta: {
          section,
        },
        type: PLAN_SELECT,
        payload: {
          planId: 249,
          networkId: 1,
          index: 0,
          multiMode: false,
          carrier: null,
        },
      },
    ];
    expect(store.getActions()).toEqual(expectedActions);
    expect(renderedComponent.find('.replace-match').length).toBe(1);
  });
});
