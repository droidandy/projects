import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState } from '@benrevo/benrevo-react-quote';
import clientsReducerState from './../reducer/clientsReducerState';
import { additionalState } from './../reducer/state';
import AlternativesRowView from './../components/AlternativesRowView';
// import mockDetailedPlan from './../Detail/tests/detailedPlan.json';
import mockDetailedPlanWithoutCurrent from './detailedPlanWCurrent.json';
import allPlans from './allPlans.json';
import allRx from './allRx.json';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<AlternativesRowView />', () => {
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
  const section = 'medical';
  allPlans.splice(0, 1);
  const finalQuoteStateWithPlans = finalQuoteState
    .setIn(['medical', 'allPlans'], fromJS(allPlans))
    .setIn(['medical', 'allRx'], fromJS(allRx));
  beforeAll(() => {
    const initialState = fromJS({
      presentation: finalQuoteStateWithPlans,
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
  });
  const params = {
    clientId: 1,
  };
  const planIndex = 0;

  it('should render the AlternativesRowView with empty current', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AlternativesRowView
            section={section}
            detailedPlan={mockDetailedPlanWithoutCurrent}
            planIndex={planIndex}
            openModal={jest.fn()}
            params={params}
            Filters={jest.fn()}
            addAltPlan={jest.fn()}
            selectNtPlan={jest.fn()}
            setSelectedPlan={jest.fn()}
            setSelectedRxPlan={jest.fn()}
            closeModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.alternatives-block').length).toBe(1);
    expect(renderedComponent.find('.empty-current').length).toBe(2);
    expect(renderedComponent.find('.empty-current-rx').length).toBe(2);
  });
});
