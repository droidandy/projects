import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import {
  Comparsion,
  QuoteState,
} from '@benrevo/benrevo-react-quote';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import ComparsionPage from './../ComparsionPage';

configure({ adapter: new Adapter() });

describe('<ComparsionPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
      clients: clientsReducerState,
      presentation: QuoteState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';
  const uhcCarrier = {
    id: '7',
    carrier: {
      name: 'UHC',
      carrierId: 1,
    },
  };

  it('should render the ComparePage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ComparsionPage
            section={section}
            index={0}
            changePage={jest.fn()}
            selectPlan={jest.fn()}
            carrier={uhcCarrier}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(Comparsion).length).toBe(1);
  });
});
