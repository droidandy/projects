import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import RowHeader from './../components/RowHeader';

configure({ adapter: new Adapter() });

describe('<RowHeader />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const name = 'HMO';
  const type = 'current';
  const section = 'medical';
  const carrier = {
    carrier: {
      name: 'anthem',
    },
  };
  const currentPlan = MedicalPlans.plans[0];
  it('should render the RowHeader', () => {
    const additionalClassName = 'additionalClassName1';
    const multyMode = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RowHeader
            name={name}
            network={false}
            type={type}
            section={section}
            attributes={[]}
            carrier={carrier}
            onAddBenefits={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            additionalClassName={additionalClassName}
            plan={currentPlan}
            editPlan={jest.fn()}
            multiMode={multyMode}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.header-column').length).toBe(1);
  });
  it('should render the add-benefit-info button', () => {
    const additionalClassName = 'additionalClassName1';
    const multyMode = false;
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <RowHeader
            name={name}
            network={false}
            type={type}
            section={section}
            attributes={[]}
            carrier={carrier}
            onAddBenefits={jest.fn()}
            downloadPlanBenefitsSummary={jest.fn()}
            additionalClassName={additionalClassName}
            plan={currentPlan}
            editPlan={jest.fn()}
            multiMode={multyMode}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.add-benefit-info').length).toBe(2);
  });
});
