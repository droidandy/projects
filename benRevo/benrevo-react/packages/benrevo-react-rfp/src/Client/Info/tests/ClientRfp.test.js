import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import SectionRfp from '../../../Section';

configure({ adapter: new Adapter() });

describe('<VisionRfp />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the Info Client page', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <SectionRfp
            route={{
              name: 'rfpClient',
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

    expect(renderedComponent.find('.medicalRfpMainContainer').hostNodes().length).toBe(1);
  });
});
