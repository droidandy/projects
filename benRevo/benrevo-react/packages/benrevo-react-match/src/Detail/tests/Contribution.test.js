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
import Contribution from './../components/Contribution';
export const finalQuoteState = QuoteState.mergeDeep(additionalState);

configure({ adapter: new Adapter() });

describe('<Contribution />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: finalQuoteState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  const section = 'medical';
  const params = {
    clientId: 1,
  };

  it('should render the Contribution', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Contribution section={section} params={params} />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('.input').forEach((node) => {
      node.simulate('change');
    });
    expect(renderedComponent.find('.presentation-modal-contribution').length).toBe(1);
  });
});
