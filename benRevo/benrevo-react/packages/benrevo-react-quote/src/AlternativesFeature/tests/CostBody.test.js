import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans, MedicalPlans3 } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import CostBody from './../components/CostBody';

configure({ adapter: new Adapter() });

describe('<CostBody />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  it('should render the CostBody', () => {
    const currentPlan = MedicalPlans.plans[0];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CostBody
            plan={currentPlan}
            costClass={'alt-table-column first-plan blue'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alt-table-column.first-plan.blue').length).toBe(2);
    expect(renderedComponent.find('.value-row').length).toBe(12);
  });

  it('should render the CostBody', () => {
    const currentPlan = MedicalPlans3.plans[2];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <CostBody
            plan={currentPlan}
            costClass={'alt-table-column first-plan blue'}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alt-table-column.first-plan.blue').length).toBe(2);
    expect(renderedComponent.find('.value-row').length).toBe(12);
  });
});
