import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MedicalPlans2, MedicalPlans3, DentalPlans, VisionPlans, authReducerState } from '@benrevo/benrevo-react-core';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import MedicalPlans from './medicalPlans2.json';
import AlternativesTable from './../components/AlternativesTable';
import { initialPresentationMasterState } from './../../reducer/state';

configure({ adapter: new Adapter() });

describe('<AlternativesTable />', () => {
  const carrierList = [
    {
      id: '1',
      carrier: {
        displayName: 'Blue Shield',
        name: 'Blue Shield',
      },
    },
    {
      id: '5',
      carrier: {
        displayName: 'Anthem Blue Cross',
        name: 'Anthem Blue Cross',
      },
    },
    {
      id: '2',
      carrier: {
        displayName: 'United Health Care',
        name: 'United Health Care',
      },
    },
  ];

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

  const loading = false;
  const index = 0;
  const carrier = {
    carrier: {
      carrierName: 'anthem',
    },
  };
  const multiMode = false;
  const externalRX = false;
  const showNewPlan = false;
  window.requestAnimationFrame = jest.fn();
  window.cancelAnimationFrame = jest.fn();
  it('should render the Alternatives table medical1 with intRX', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesTable
            selectPlan={jest.fn()}
            section={'medical'}
            networkId={6}
            alternativesPlans={MedicalPlans}
            carrierList={carrierList}
            stateAlternativesPlans={{}}
            setStateAlternativesPlans={jest.fn()}
            saveCurrentPlan={jest.fn()}
            loading={loading}
            index={index}
            carrier={carrier}
            carrierName={'anthem'}
            motionLink={'link'}
            changePlanField={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            multiMode={multiMode}
            externalRX={externalRX}
            showNewPlan={showNewPlan}
            editPlan={jest.fn()}
            cancelAdding={jest.fn()}
            addPlan={jest.fn()}
            newPlan={{}}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            openedOptionsType={'HMO'}
            deletePlan={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-block').length).toBe(1);
    expect(renderedComponent.find('.alternatives-block').html().indexOf('∞')).toBe(-1);
  });
  it('should render the Alternatives table medical2 with extRX', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesTable
            selectPlan={jest.fn()}
            section={'medical'}
            networkId={6}
            alternativesPlans={MedicalPlans2}
            carrierList={carrierList}
            stateAlternativesPlans={[]}
            setStateAlternativesPlans={jest.fn()}
            saveCurrentPlan={jest.fn()}
            loading={loading}
            index={index}
            carrier={carrier}
            carrierName={'anthem'}
            motionLink={'link'}
            changePlanField={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            multiMode={multiMode}
            externalRX={externalRX}
            showNewPlan={showNewPlan}
            editPlan={jest.fn()}
            cancelAdding={jest.fn()}
            addPlan={jest.fn()}
            newPlan={{}}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            openedOptionsType={'HMO'}
            deletePlan={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-block').length).toBe(1);
    expect(renderedComponent.find('.alternatives-block').html().indexOf('∞')).toBe(-1);
  });

  it('should render the Alternatives table medical3 with extRX', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesTable
            selectPlan={jest.fn()}
            section={'medical'}
            networkId={6}
            alternativesPlans={MedicalPlans3}
            carrierList={carrierList}
            stateAlternativesPlans={[]}
            setStateAlternativesPlans={jest.fn()}
            saveCurrentPlan={jest.fn()}
            loading={loading}
            index={index}
            carrier={carrier}
            carrierName={'anthem'}
            motionLink={'link'}
            changePlanField={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            multiMode={multiMode}
            externalRX={externalRX}
            showNewPlan={showNewPlan}
            editPlan={jest.fn()}
            cancelAdding={jest.fn()}
            addPlan={jest.fn()}
            newPlan={{}}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            openedOptionsType={'HMO'}
            deletePlan={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-block').length).toBe(1);
    expect(renderedComponent.find('.alternatives-block').html().indexOf('∞')).toBe(-1);
  });

  it('should render the Alternatives table dental', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesTable
            selectPlan={jest.fn()}
            section={'medical'}
            networkId={6}
            alternativesPlans={DentalPlans}
            carrierList={carrierList}
            stateAlternativesPlans={[]}
            setStateAlternativesPlans={jest.fn()}
            saveCurrentPlan={jest.fn()}
            loading={loading}
            index={index}
            carrier={carrier}
            carrierName={'anthem'}
            motionLink={'link'}
            changePlanField={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            multiMode={multiMode}
            externalRX={externalRX}
            showNewPlan={showNewPlan}
            editPlan={jest.fn()}
            cancelAdding={jest.fn()}
            addPlan={jest.fn()}
            newPlan={{}}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            openedOptionsType={'HMO'}
            deletePlan={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-block').length).toBe(1);
    expect(renderedComponent.find('.alternatives-block').html().indexOf('∞')).toBe(-1);
  });
  it('should render the Alternatives table vision', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesTable
            selectPlan={jest.fn()}
            section={'medical'}
            networkId={6}
            alternativesPlans={VisionPlans}
            carrierList={carrierList}
            stateAlternativesPlans={[]}
            setStateAlternativesPlans={jest.fn()}
            saveCurrentPlan={jest.fn()}
            loading={loading}
            index={index}
            carrier={carrier}
            carrierName={'anthem'}
            motionLink={'link'}
            changePlanField={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            multiMode={multiMode}
            externalRX={externalRX}
            showNewPlan={showNewPlan}
            editPlan={jest.fn()}
            cancelAdding={jest.fn()}
            addPlan={jest.fn()}
            newPlan={{}}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            openedOptionsType={'HMO'}
            deletePlan={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('a').forEach((node) => {
      node.simulate('click');
    });
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.alternatives-block').length).toBe(1);
    expect(renderedComponent.find('.alternatives-block').html().indexOf('∞')).toBe(-1);
  });
});
