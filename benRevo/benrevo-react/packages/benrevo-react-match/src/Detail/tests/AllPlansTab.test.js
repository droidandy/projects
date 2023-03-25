import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure, shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { Loader, Image } from 'semantic-ui-react';
import { QuoteState } from '@benrevo/benrevo-react-quote';
import clientsReducerState from './../../reducer/clientsReducerState';
import { additionalState } from './../../reducer/state';
import AllPlansTab from './../components/AllPlansTab';
import PlanNameDropdown from './../components/PlanNameDropdown';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<AllPlansTab />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';
  const params = {
    clientId: 1,
  };

  it('should render the AllPlansTab', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AllPlansTab section={section} params={params} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.all-plans-tab').length).toBe(2);
  });

  it('should render all-plans-body-row', () => {
    const detailedPlans = [{
      type: 'test',
      currentPlan: { name: 'testname', type: 'test' },
      networkName: 'test',
      rfpQuoteOptionNetworkId: 1,
      rfpQuoteNetworkPlanId: 1,
      percentDifference: 5,
    }];
    const finalQuoteReducerState = finalQuoteState
      .setIn(['medical', 'openedOption', 'detailedPlans'], fromJS(detailedPlans));
    const initialState = fromJS({
      presentation: finalQuoteReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AllPlansTab section={section} params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.all-plans-body-row').length).toBe(2);
  });

  it('should render loader', () => {
    const detailedPlans = [{
      type: 'test',
      currentPlan: { name: 'testname', type: 'test' },
      networkName: 'test',
      rfpQuoteOptionNetworkId: 1,
      rfpQuoteNetworkPlanId: 1,
      percentDifference: 5,
    }];
    const finalQuoteReducerState = finalQuoteState
      .setIn(['medical', 'openedOption', 'detailedPlans'], fromJS(detailedPlans))
      .setIn(['medical', 'plansForDropDownLoading'], true);
    const initialState = fromJS({
      presentation: finalQuoteReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AllPlansTab section={section} params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Loader).length).toBe(1);
  });

  it('should render warning', () => {
    const detailedPlans = [{
      type: 'test',
      networkName: 'test',
      rfpQuoteOptionNetworkId: 1,
      rfpQuoteNetworkPlanId: 1,
    }];
    const finalQuoteReducerState = finalQuoteState
      .setIn(['medical', 'openedOption', 'detailedPlans'], fromJS(detailedPlans))
      .setIn(['medical', 'openedOption', 'id'], 0)
      .setIn(['medical', 'openedOptionContributions'], fromJS([{ proposedEnrollmentTotal: 1 }]))
      .setIn(['medical', 'violationNotification'], fromJS([true]))
      .setIn(['medical', 'violationModalText'], fromJS([{}]))
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'test' } } }));
    const initialState = fromJS({
      presentation: finalQuoteReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AllPlansTab section={section} params={params} />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find(Image).length).toBe(2);
    expect(renderedComponent.find('.warning-card').length).toBe(1);
  });

  it('should render all conditional branches that haven\'t been tested', () => {
    const detailedPlans = [{
      type: 'test',
      networkName: 'test',
      rfpQuoteOptionNetworkId: 1,
      rfpQuoteNetworkPlanId: 1,
      rfpQuoteNetworkId: 1,
    }];
    const finalQuoteReducerState = finalQuoteState
      .setIn(['medical', 'openedOption', 'detailedPlans'], fromJS(detailedPlans))
      .setIn(['medical', 'openedOption', 'id'], 0)
      .setIn(['medical', 'openedOptionContributions'], fromJS([{ proposedEnrollmentTotal: 1 }]))
      .setIn(['medical', 'plansForDropDown'], fromJS({ 1: 'test' }))
      .setIn(['medical', 'violationNotification'], fromJS([true]))
      .setIn(['medical', 'violationModalText'], fromJS([{}]))
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'test' } } }));
    const initialState = fromJS({
      presentation: finalQuoteReducerState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
    const renderedComponent = shallow(
      <AllPlansTab section={section} params={params} store={store} />
    ).dive();
    expect(renderedComponent.find(PlanNameDropdown).length).toBe(1);
  });
});
