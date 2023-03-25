import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import {
  Options,
  QuoteState,
} from '@benrevo/benrevo-react-quote';
import { authReducerState } from '@benrevo/benrevo-react-core';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import OptionsPage from './../OptionsPage';

configure({ adapter: new Adapter() });

describe('<OptionsPage />', () => {
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
  const carrier = {
    carrier: {
      carrierId: 1,
    },
  };
  it('should render the OptionsPage', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <OptionsPage section={section} carrier={carrier} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(Options).length).toBe(1);
  });
});
