import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import BenefitsHead from './../components/BenefitsHead';

configure({ adapter: new Adapter() });

describe('<BenefitsHead />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  it('should render the BenefitsHead', () => {
    const planTemplate = MedicalPlans.plans[0];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsHead
            planTemplate={planTemplate}
            setBorderColor={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alt-table-column.first-plan.white.current').length).toBe(2);
  });
  it('should render the BenefitsHead', () => {
    const planTemplate = MedicalPlans.plans[1];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsHead
            planTemplate={planTemplate}
            setBorderColor={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alt-table-column.first-plan.white.matchPlan').length).toBe(2);
    expect(renderedComponent.find('.center-aligned.benefits-row.separated').length).toBe(0);
  });
  it('should render the BenefitsHead', () => {
    const planTemplate = MedicalPlans.plans[2];
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <BenefitsHead
            planTemplate={planTemplate}
            setBorderColor={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.center-aligned.benefits-row.separated').length).toBe(2);
  });
});
