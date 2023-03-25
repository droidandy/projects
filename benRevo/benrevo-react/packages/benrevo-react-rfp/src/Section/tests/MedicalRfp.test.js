import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import configureStore from 'redux-mock-store';
import MedicalRfp from '../';

configure({ adapter: new Adapter() });

describe('<MedicalRfp />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the MedicalRfp page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <MedicalRfp
            route={{
              name: 'rfpMedical',
              childRoutes: [
                {
                  path: 'options',
                },
              ],
            }}
          />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('SubNavigation').length).toBe(1);
  });
});
