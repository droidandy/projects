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
import AlternativesColumnComponent from './../../components/AlternativesColumn/AlternativesColumn';
import { bottomSeparatedBenefitsSysName, bottomSeparatedRxSysName } from './../../constants';
import currentPlan from './currentPlan.json';
import selectedPlan from './selectedPlan.json';
import selectedSecondPlan from './selectedSecondPlan.json';

export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<AlternativesColumnComponent />', () => {
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

  it('should render the AlternativesColumnComponent', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesColumnComponent
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={selectedPlan}
            editPlan={jest.fn()}
            accordionClick={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            attributes={Object.keys(attributes)}
            activeIndex={activeIndex}
            currentTotal={currentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={jest.fn()}
            accordionActiveIndex={[{}, {}, {}]}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(1);
    expect(renderedComponent.find('.additional.summary').length).toBe(0);
    expect(renderedComponent.find('.additional.swap').length).toBe(0);
    expect(renderedComponent.find('.cost-accordion').length).toBe(3);
    expect(renderedComponent.find('.benefits-accordion').length).toBe(3);
    expect(renderedComponent.find('.rx-accordion').length).toBe(3);
    expect(renderedComponent.find('.additional.more-less').length).toBe(2);
    expect(renderedComponent.find('.additional-button.add-alternative').length).toBe(0);
  });

  it('should render the AlternativesColumnComponent', () => {
    const thirdColumn = true;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesColumnComponent
            section={section}
            carrierName={carrierName}
            motionLink={motionLink}
            multiMode={multiMode}
            carrier={carrier}
            plan={selectedSecondPlan}
            editPlan={jest.fn()}
            accordionClick={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            attributes={Object.keys(attributes)}
            activeIndex={activeIndex}
            currentTotal={currentPlan.total}
            bottomSeparatedBenefitsSysName={bottomSeparatedBenefitsSysName}
            bottomSeparatedRxSysName={bottomSeparatedRxSysName}
            externalRX={externalRX}
            showBenefits={showBenefits}
            showIntRX={showIntRX}
            rfpQuoteOptionNetworkId={rfpQuoteOptionNetworkId}
            editBenefitInfo={jest.fn()}
            thirdColumn={thirdColumn}
            accordionActiveIndex={[{}, {}, {}]}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-table-column').length).toBe(1);
    expect(renderedComponent.find('.additional.summary').length).toBe(2);
    expect(renderedComponent.find('.additional.swap').length).toBe(2);
  });
});
