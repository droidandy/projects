import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialPresentationMasterState } from './../reducer/state';
import Presentation from '../Presentation';

configure({ adapter: new Adapter() });

describe('<Presentation />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
  });

  it('should render the Presentation page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Presentation params={{ clientId: '1' }} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.main-dimmer').hostNodes().length).toBe(1);
  });
});
