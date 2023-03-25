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
import PlanBenefitsDropdown from './../components/PlanBenefitsDropdown';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<PlanBenefitsDropdown />', () => {
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
  const detailedPlan = {};
  const planIndex = 0;

  it('should render the PlanBenefitsDropdown', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <PlanBenefitsDropdown
            section={section}
            detailedPlan={detailedPlan}
            planIndex={planIndex}
            openModal={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.plan-benefits-dropdown').length).toBe(2);
  });
});
