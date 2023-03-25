import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import configureStore from 'redux-mock-store';
import { initialState as gaInitialState } from './../reducer';
import EmailVerificationLanding from './../EmailVerificationLanding';

configure({ adapter: new Adapter() });

describe('<EmailVerificationLanding />', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;

  beforeAll(() => {
    const initialState = fromJS({
      ga: gaInitialState,
    });
    store = mockStore(initialState);
  });
  it('should render the EmailVerificationLanding', () => {
    const renderedComponent = mount(
      <Provider store={store}>
        <IntlProvider locale="en">
          <EmailVerificationLanding />
        </IntlProvider>
      </Provider>
    );

    expect(renderedComponent.find('.emailVerification').length).toBe(2);
  });
});
