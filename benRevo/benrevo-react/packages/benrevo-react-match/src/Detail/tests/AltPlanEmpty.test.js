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
import AltPlanEmpty from './../components/AltPlanEmpty';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<AltPlanEmpty />', () => {
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
  const showAddPlanLabel = true;
  const carrier = {
    carrier: {
      carrierName: 'Name',
    },
  };
  const quoteType = 'STANDARD';

  it('should render the AltPlanEmpty Add Alternative Plan', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AltPlanEmpty
            section={section}
            altEmptyClick={jest.fn()}
            carrier={carrier}
            quoteType={quoteType}
            showAddPlanLabel={showAddPlanLabel}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.card-add.alt-plan-empty').length).toBe(2);
    renderedComponent.find('.card-add-inner').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.title').text()).toBe('Add Alternative Plan');
  });

  it('should render the AltPlanEmpty Choose Alternative Plan', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <AltPlanEmpty
            section={section}
            altEmptyClick={jest.fn()}
            carrier={carrier}
            quoteType={quoteType}
            showAddPlanLabel={false}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.title').text()).toBe('Choose Alternative Plan');
  });
});
