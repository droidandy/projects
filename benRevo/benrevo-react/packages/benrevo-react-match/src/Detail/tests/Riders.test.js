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
import Riders from './../components/Riders';
import mockRiders from './riders.json';
import mockDetailedPlan from './detailedPlan.json';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<Riders />', () => {
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
    const OPTION_RIDER_GET_SUCCESS = 'app/PresentationPage/OPTION_RIDER_GET_SUCCESS';
    const action = { type: OPTION_RIDER_GET_SUCCESS, payload: mockRiders, meta: { section } };
    const initialState = fromJS({
      presentation: optionRiderGetSuccess(finalQuoteState, action),
      clients: clientsReducerState,
      app: appReducerState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';

  it('should render the Riders', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Riders
            section={section}
            detailedPlan={mockDetailedPlan}
          />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      expect(node.text()).toBe('Selected');
    });
    expect(renderedComponent.find('.riders').length).toBe(2);
    expect(renderedComponent.find('.all-plans-table').length).toBe(2);
  });
});

function optionRiderGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'openedOptionRider'], fromJS(action.payload));
}
