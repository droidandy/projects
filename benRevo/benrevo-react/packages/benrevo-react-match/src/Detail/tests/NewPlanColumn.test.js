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
import NewPlanColumn from './../components/NewPlanColumn';
import { GET_PLAN_FOR_BENEFITS_SUCCESS } from './../../constants';
import mockDetailedPlan from './detailedPlan.json';
// import { setNewPlanBenefits } from './../../reducer/match';
import mockDetailedPlanMulti from './detailedPlanMulti.json';
import selectedPlan from './selectedPlan.json';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<NewPlanColumn />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const data = selectedPlan;
    const action = { type: GET_PLAN_FOR_BENEFITS_SUCCESS, payload: { data }, meta: { section } };
    const initialState = fromJS({
      presentation: setNewPlanBenefits(finalQuoteState, action),
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });
  const section = 'medical';
  const params = {
    clientId: 1,
  };

  const values = [
    '0',
    '0',
    '$5/$15',
    '25',
    '45',
    '30% up to $250',
    '$12.50/$37.50/$75/$135',
  ];

  it('should render the NewPlanColumn', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NewPlanColumn section={section} params={params} detailedPlan={{ currentPlan: { cost: {} } }} cancelAddingPlan={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.new-plan-next').length).toBe(2);
  });

  it('should render the NewPlanColumn with data', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NewPlanColumn section={section} params={params} detailedPlan={mockDetailedPlan} cancelAddingPlan={jest.fn()} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.new-plan-next').length).toBe(2);
  });

  it('should render the NewPlanColumn with multi and rx', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NewPlanColumn
            section={section}
            params={params}
            detailedPlan={mockDetailedPlanMulti}
            cancelAddingPlan={jest.fn()}
            editPlan={selectedPlan}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.new-plan-next').length).toBe(2);
    expect(renderedComponent.find('.new-row-grid.rx').length).toBe(16);
    renderedComponent.find('.new-row-grid.rx input').forEach((node, index) => {
      expect(node.props().value).toBe(values[index]);
    });
  });

  it('should render the NewPlanColumn with multi without values', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <NewPlanColumn
            section={section}
            params={params}
            detailedPlan={mockDetailedPlanMulti}
            cancelAddingPlan={jest.fn()}
            status="editSelected"
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.new-plan-next').length).toBe(2);
    expect(renderedComponent.find('.new-row-grid.rx').length).toBe(16);
    expect(renderedComponent.find('.new-row-grid.rx input').first().props().value).toBe('0');
  });
});

function setNewPlanBenefits(state, action) {
  const { section } = action.meta;
  const { data } = action.payload;
  return state
    .setIn(['benefitsLoading'], false)
    .setIn([section, 'selectedPlan'], fromJS(data))
    .setIn([section, 'newPlan', 'pnnId'], data.pnnId)
    .setIn([section, 'newPlan', 'nameByNetwork'], data.name)
    .setIn([section, 'newPlan', 'benefits'], fromJS(data.benefits))
    .setIn([section, 'newPlan', 'rx'], fromJS(data.rx));
}
