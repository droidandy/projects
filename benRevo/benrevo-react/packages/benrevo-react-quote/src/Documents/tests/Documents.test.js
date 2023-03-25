import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import { initialPresentationMasterState } from './../../reducer/state';
import Documents from '../';

configure({ adapter: new Adapter() });

describe('<Documents />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the Documents page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Documents />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.presentation-documents').length).toBe(1);
  });
});
