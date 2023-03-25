import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { QuoteState } from '@benrevo/benrevo-react-quote';
import { Accordion } from 'semantic-ui-react';
import clientsReducerState from './../../reducer/clientsReducerState';
import { additionalState } from './../../reducer/state';
import VerticalDivider from './../components/VerticalDivider';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<Virtical Divider />', () => {
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


  it('should render the AltPlanEmpty', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <VerticalDivider
            activeIndex={[]}
            accordionClick={jest.fn()}
          />
        </IntlProvider>
      </Provider>
    );
    expect(renderedComponent.find('.vertical-divider').length).toBe(1);
    renderedComponent.find(Accordion.Title).forEach((node) => {
      node.simulate('click');
    });
  });
});
