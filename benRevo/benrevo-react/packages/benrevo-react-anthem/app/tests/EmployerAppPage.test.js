import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';
import { clientsReducerState } from '@benrevo/benrevo-react-clients';
import EmployerApplication from './../pages/OnBoarding/EmployerApp';
configure({ adapter: new Adapter() });
describe('<EmployerApplication />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      clients: clientsReducerState,
    });
    store = mockStore(initialState);
  });

  it('should render the EmployerApplication', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <EmployerApplication />
        </IntlProvider>
      </Provider>
    );
    renderedComponent.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(renderedComponent.find('.medicalRfpMainContainer').length).toBe(2);
  });
});
