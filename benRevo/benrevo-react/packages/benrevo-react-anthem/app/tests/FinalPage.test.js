import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import {
  Final,
  QuoteState,
} from '@benrevo/benrevo-react-quote';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import FinalPage from './../pages/Quote/FinalPage';

configure({ adapter: new Adapter() });

describe('<FinalPage />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: QuoteState,
    });
    store = mockStore(initialState);
  });

  it('should render the FinalPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <FinalPage />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(Final).length).toBe(1);
  });
});
