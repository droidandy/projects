import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { MedicalPlans } from '@benrevo/benrevo-react-core';
import { initialPresentationMasterState } from './../../reducer/state';
import NewPlanColumn from './../components/NewPlanColumn';

configure({ adapter: new Adapter() });

describe('<NewPlanColumn />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });
  const currentPlan = MedicalPlans.plans[0];
  const multiMode = false;
  it('should render the NewPlanColumn', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NewPlanColumn
            offset={2}
            newPlan={currentPlan}
            changePlanField={jest.fn()}
            networkIndex={1}
            addPlan={jest.fn()}
            cancelAddingPlan={jest.fn()}
            section={'medical'}
            status={'new'}
            planIndex={null}
            alternativesPlans={MedicalPlans.plans}
            currentPlan={currentPlan}
            rfpQuoteNetworkId={1}
            updatePlanField={jest.fn()}
            multiMode={multiMode}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('input').forEach((node) => {
      node.simulate('change');
    });
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.new-plan-next').length).toBe(2);
  });
});
