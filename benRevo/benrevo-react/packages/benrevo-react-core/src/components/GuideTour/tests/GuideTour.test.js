import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GuideTour from './..';

configure({ adapter: new Adapter() });

describe('<GuideTour />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  const authReducerState = fromJS({
    firstName: '',
    lastName: '',
    loginCount: null,
    loginCountLoading: true,
    isGALoading: true,
    expired: null,
    userMetadata: {},
    userEULA: false,
    isGA: false,
    brokerages: [],
    attributes: [],
    brokerageRole: ['user'],
  });

  beforeAll(() => {
    const initialState = fromJS({
      profile: authReducerState,
    });
    store = mockStore(initialState);
  });

  const route = {
    childRoutes: [],
  };
  const page = 'ViewAlternative';

  it('should render the GuideTour', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <GuideTour route={route} page={page} />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find(GuideTour).length).toBe(1);
  });
});
